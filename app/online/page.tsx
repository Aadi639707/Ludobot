"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Room = { id: string; code: string; status: string };
type Player = { id: string; room_id: string; name: string | null; color: string };

const COLORS = ["RED", "BLUE"];

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function getPlayerId() {
  const k = "ludo_player_id";
  const existing = localStorage.getItem(k);
  if (existing) return existing;
  const id = "p_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
  localStorage.setItem(k, id);
  return id;
}

export default function Online() {
  const [playerId, setPlayerId] = useState("");
  const [name, setName] = useState("Player");
  const [codeInput, setCodeInput] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [msg, setMsg] = useState("Create room or join using code.");

  useEffect(() => setPlayerId(getPlayerId()), []);

  async function loadPlayers(roomId: string) {
    const { data, error } = await supabase.from("players").select("*").eq("room_id", roomId).order("joined_at");
    if (error) return setMsg("Load players failed: " + error.message);
    setPlayers((data ?? []) as any);
  }

  async function createRoom() {
    const code = genCode();
    const { data, error } = await supabase.from("rooms").insert({ code, status: "waiting" }).select().single();
    if (error) return setMsg("Create failed: " + error.message);

    setRoom(data as any);
    setMsg("Room created: " + code);

    await supabase.from("players").insert({ room_id: (data as any).id, player_id: playerId, name, color: "RED" });
    await loadPlayers((data as any).id);
  }

  async function joinRoom() {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;

    const { data, error } = await supabase.from("rooms").select("*").eq("code", code).single();
    if (error) return setMsg("Join failed: " + error.message);

    const roomId = (data as any).id as string;

    const { data: existing } = await supabase.from("players").select("*").eq("room_id", roomId);
    const used = new Set((existing ?? []).map((p: any) => p.color));
    const color = COLORS.find(c => !used.has(c));

    if (!color) return setMsg("Room full (MVP 2 players).");

    setRoom(data as any);
    await supabase.from("players").insert({ room_id: roomId, player_id: playerId, name, color });
    await loadPlayers(roomId);

    setMsg("Joined room: " + code);
  }

  // realtime players updates
  useEffect(() => {
    if (!room?.id) return;

    loadPlayers(room.id);

    const ch = supabase
      .channel("players:" + room.id)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: room_id=eq.${room.id}' },
        () => loadPlayers(room.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id]);

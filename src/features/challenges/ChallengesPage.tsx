import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Legacy page — redirects to new navigation
export function ChallengesPage() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/"); }, [navigate]);
  return null;
}

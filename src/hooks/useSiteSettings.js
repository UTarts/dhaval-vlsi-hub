import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useSiteSettings(pageId, defaultData) {
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(`site_cache_${pageId}`);
    return cached ? JSON.parse(cached) : defaultData;
  });
  
  const [loading, setLoading] = useState(!localStorage.getItem(`site_cache_${pageId}`));

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: result, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("id", pageId)
          .single();

        if (error) throw error;

        if (result?.value) {
          setData(result.value);
          localStorage.setItem(`site_cache_${pageId}`, JSON.stringify(result.value));
        }
      } catch (error) {
        console.error(`Error fetching ${pageId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [pageId]);

  return { data, loading };
}
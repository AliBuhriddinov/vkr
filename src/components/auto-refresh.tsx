"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Тихо перезапрашивает серверные данные на интервале (статусы, новые заявки),
// чтобы страница обновлялась без ручной перезагрузки. На паузе, когда вкладка
// неактивна — лишних запросов к БД нет. Состояние форм router.refresh() сохраняет.
export function AutoRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}

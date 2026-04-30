"use client";

import { useTransition } from "react";
import { deleteProduct } from "./actions";

export function DeleteProductButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const ok = window.confirm(
          `Xoá sản phẩm "${title}"?\nHành động này không thể hoàn tác.`,
        );
        if (!ok) return;
        startTransition(() => {
          void deleteProduct(id);
        });
      }}
    >
      <button
        type="submit"
        className="admin-btn admin-btn--danger"
        id={`delete-${id}`}
        disabled={isPending}
      >
        {isPending ? "Đang xoá…" : "Xoá"}
      </button>
    </form>
  );
}

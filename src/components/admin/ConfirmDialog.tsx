"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  busy = false,
  onCancelAction,
  onConfirmAction,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onCancelAction: () => void;
  onConfirmAction: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onCancelAction} />
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-lift"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-500">
              <AlertTriangle className="size-7" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
            <p className="mt-1.5 text-sm text-ink-soft">{message}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={onCancelAction} className="btn btn-ghost flex-1 py-2.5 text-sm">
                Cancel
              </button>
              <button
                onClick={onConfirmAction}
                disabled={busy}
                className="btn flex-1 bg-red-500 py-2.5 text-sm text-white hover:bg-red-600 disabled:opacity-70"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

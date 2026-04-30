"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const INITIAL: LoginState = {};

export default function LoginForm({ initialError }: { initialError?: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL);
  const errorMsg = state.error ?? initialError;

  return (
    <form action={formAction} className="admin-form" id="login-form">
      {errorMsg && (
        <div className="admin-alert admin-alert--error" role="alert">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="admin@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="admin-field">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="admin-btn admin-btn--primary"
        disabled={isPending}
        id="btn-login"
      >
        {isPending ? (
          <>
            <span className="admin-spinner" /> Đang đăng nhập...
          </>
        ) : (
          "Đăng nhập"
        )}
      </button>
    </form>
  );
}

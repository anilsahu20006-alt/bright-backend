// Compat shim: react-router-dom -> @tanstack/react-router
import {
  Link as TLink,
  useNavigate as useTNav,
  useParams as useTParams,
  useLocation as useTLocation,
  useSearch as useTSearch,
  Outlet,
} from "@tanstack/react-router";
import { forwardRef } from "react";

export const Link = forwardRef<HTMLAnchorElement, any>(function Link(
  { to, state, replace, children, ...rest },
  ref,
) {
  return (
    <TLink ref={ref as any} to={to as any} state={state as any} replace={replace} {...(rest as any)}>
      {children as any}
    </TLink>
  );
});

export interface NavLinkProps {
  to: string;
  end?: boolean;
  className?: string | ((s: { isActive: boolean; isPending: boolean }) => string);
  children?: any;
  [key: string]: any;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, end, className, children, ...rest },
  ref,
) {
  return (
    <TLink
      ref={ref as any}
      to={to as any}
      activeOptions={{ exact: !!end }}
      {...(rest as any)}
    >
      {((state: any) => {
        const s = { isActive: !!state?.isActive, isPending: false };
        const cls = typeof className === "function" ? className(s) : className;
        const node = typeof children === "function" ? children(s) : children;
        return <span className={cls}>{node}</span>;
      }) as any}
    </TLink>
  );
});

export function useNavigate() {
  const navigate = useTNav();
  return (to: string | number, opts?: { state?: unknown; replace?: boolean }) => {
    if (typeof to === "number") {
      if (typeof window !== "undefined") window.history.go(to);
      return;
    }
    navigate({
      to: to as any,
      replace: opts?.replace,
      state: opts?.state as any,
    });
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useTParams({ strict: false }) as T;
}

export function useLocation() {
  const loc = useTLocation();
  return {
    pathname: loc.pathname,
    search: loc.searchStr,
    hash: loc.hash,
    state: (loc.state as any) ?? null,
  };
}

export function useSearchParams() {
  const search = useTSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useTNav();
  const params = new URLSearchParams();
  Object.entries(search || {}).forEach(([k, v]) => {
    if (v != null) params.set(k, String(v));
  });
  const setParams = (
    next:
      | URLSearchParams
      | ((p: URLSearchParams) => URLSearchParams)
      | Record<string, string>,
  ) => {
    let np: URLSearchParams;
    if (typeof next === "function") np = next(new URLSearchParams(params));
    else if (next instanceof URLSearchParams) np = next;
    else np = new URLSearchParams(next);
    const obj: Record<string, string> = {};
    np.forEach((v, k) => (obj[k] = v));
    navigate({ search: obj as any });
  };
  return [params, setParams] as const;
}

export { Outlet };

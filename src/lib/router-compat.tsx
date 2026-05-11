// Compat shim: react-router-dom -> @tanstack/react-router
import {
  Link as TLink,
  useNavigate as useTNav,
  useParams as useTParams,
  useLocation as useTLocation,
  useSearch as useTSearch,
  Outlet,
} from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

type AnyProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  state?: unknown;
  replace?: boolean;
  children?: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, AnyProps>(
  ({ to, state, replace, children, ...rest }, ref) => (
    // @ts-expect-error loose path typing intentional for compat
    <TLink ref={ref} to={to} state={state as any} replace={replace} {...rest}>
      {children}
    </TLink>
  ),
);
Link.displayName = "Link";

type NavLinkProps = Omit<AnyProps, "className"> & {
  end?: boolean;
  className?: string | ((s: { isActive: boolean; isPending: boolean }) => string);
  children?: ReactNode | ((s: { isActive: boolean; isPending: boolean }) => ReactNode);
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, end, className, children, ...rest }, ref) => (
    // @ts-expect-error loose path typing intentional for compat
    <TLink
      ref={ref}
      to={to}
      activeOptions={{ exact: !!end }}
      {...rest}
    >
      {(state: { isActive: boolean }) => {
        const s = { isActive: !!state?.isActive, isPending: false };
        const cls = typeof className === "function" ? className(s) : className;
        const node = typeof children === "function" ? (children as any)(s) : children;
        return (
          <span className={cls}>{node}</span>
        );
      }}
    </TLink>
  ),
);
NavLink.displayName = "NavLink";

export function useNavigate() {
  const navigate = useTNav();
  return (to: string | number, opts?: { state?: unknown; replace?: boolean }) => {
    if (typeof to === "number") {
      if (typeof window !== "undefined") window.history.go(to);
      return;
    }
    navigate({
      // @ts-expect-error loose path typing intentional
      to,
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
    next: URLSearchParams | ((p: URLSearchParams) => URLSearchParams) | Record<string, string>,
  ) => {
    let np: URLSearchParams;
    if (typeof next === "function") np = next(new URLSearchParams(params));
    else if (next instanceof URLSearchParams) np = next;
    else np = new URLSearchParams(next);
    const obj: Record<string, string> = {};
    np.forEach((v, k) => (obj[k] = v));
    // @ts-expect-error loose
    navigate({ search: obj });
  };
  return [params, setParams] as const;
}

export { Outlet };

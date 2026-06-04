"use client";

import { Component, type ReactNode } from "react";

export default class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: unknown) {
    // 3D/WebGL failures fall back gracefully; log for debugging.
    console.error("3D scene failed, using fallback:", err);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<{children: ReactNode}, {err?: string}> {
  state = { err: undefined as string | undefined };
  static getDerivedStateFromError(e: unknown) {
    return { err: e instanceof Error ? e.message : String(e) };
  }
  render() {
    if (this.state.err) {
      return (
        <div style={{padding:16,color:'tomato',fontFamily:'monospace'}}>
          <b>UI crashed:</b> {this.state.err}
        </div>
      );
    }
    return this.props.children;
  }
}

import { Button } from '@shared/ui';

export function HelloWorldPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a className="font-semibold tracking-tight" href="/">
            Startup Core
          </a>
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-4 text-sm text-slate-300"
          >
            <span>Home</span>
            <span className="text-slate-500">Modules soon</span>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-24">
        <p className="text-sm font-medium text-sky-300">Generic platform shell</p>
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Hello, world.</h1>
          <p className="text-lg leading-8 text-slate-300">
            The reusable frontend foundation is ready for the next platform capability.
          </p>
        </div>
        <div>
          <Button type="button">Explore the platform</Button>
        </div>
      </main>
    </div>
  );
}

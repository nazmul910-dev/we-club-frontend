'use client';

import { useDispatch } from 'react-redux';
import { setAccessTo, AccessTo } from '@/lib/features/auth/authSlice';

const OPTIONS: { value: AccessTo; title: string; description: string }[] = [
  {
    value: 'we_command_center',
    title: 'We Command Center',
    description: 'Access the We Command Center workspace and tools.',
  },
  {
    value: 'invictus',
    title: 'Invictus',
    description: 'Access the Invictus workspace and tools.',
  },
  {
    value: 'both',
    title: 'We Command Center + Invictus',
    description: 'Full access to both workspaces.',
  },
];

export default function AccessToStep() {
  const dispatch = useDispatch();

  return ( 
    <div>
      <h1 className="mb-1 text-center text-2xl font-semibold text-amber-400">
        Choose your access
      </h1>
      <p className="mb-8 text-center text-sm text-white/50">
        Select the plan you want to register for.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => dispatch(setAccessTo(option.value))}
            className="group flex flex-col items-center justify-center rounded-2xl border border-amber-400/20 bg-white/5 p-5  backdrop-blur-md transition-all hover:border-amber-400/60 hover:bg-amber-400/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <span className="text-base font-medium text-amber-400 group-hover:text-amber-300">
              {option.title}
            </span>
            <span className="mt-2 text-xs leading-relaxed text-white/50">
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

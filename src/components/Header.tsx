import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-5 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 group relative">
        <div className="relative mr-3 h-10 w-10 overflow-hidden rounded-xl border-[2.5px] border-stone-800 shadow-sm shadow-stone-800/20">
          <div className="absolute inset-0.5 origin-center rounded-lg bg-gradient-to-t from-stone-950/20 to-stone-950 to-95% transition delay-50 duration-300 ease-out group-hover:-translate-x-full group-hover:scale-x-50 group-hover:scale-y-75 group-hover:opacity-25 group-hover:delay-0"></div>
          <svg
            className="absolute -left-1 -top-1 h-11 w-11 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <path
              className="ease absolute origin-right translate-x-0.5 scale-50 opacity-0 blur-xs transition duration-300 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none group-hover:delay-50"
              d="M18.032 11.218a1 1 0 0 0-1.414 0l-6.075 6.075a1 1 0 0 0 0 1.414l6.075 6.075a1 1 0 0 0 1.414-1.414L13.664 19H24.75a1 1 0 1 0 0-2H13.664l4.368-4.368a1 1 0 0 0 0-1.414Z"
            ></path>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl transition-transform duration-300 group-hover:translate-x-1">
            DualDates
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 -mt-1 self-start">
            v1.0
          </span>
        </div>
      </div>

      <nav className="flex items-center gap-4">
        <Link
          href="/faq"
          className="icon-hover group flex items-center animate-float py-2 px-4 rounded-xl hover:bg-black/5 transition-colors"
        >
          <svg
            className="size-[22px] origin-bottom fill-current transition duration-300 group-hover:-rotate-12 sm:mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 28"
            aria-hidden="true"
          >
            <path d="M13.8906 26.9805C14.418 26.9805 14.9102 26.7578 15.3789 25.9492L17.5469 22.3281H21.4609C24.9531 22.3281 26.8281 20.3945 26.8281 16.9609V7.98438C26.8281 4.55078 24.9531 2.61719 21.4609 2.61719H6.36719C2.875 2.61719 1 4.53906 1 7.98438V16.9609C1 20.4062 2.875 22.3281 6.36719 22.3281H10.2344L12.4023 25.9492C12.8711 26.7578 13.3633 26.9805 13.8906 26.9805Z"></path>
            <path
              className="origin-top-left stroke-current stroke-2 text-background transition duration-250 group-hover:-rotate-3 group-hover:delay-50"
              d="M8 14H16M8 10H20.25"
              strokeLinecap="round"
            ></path>
          </svg>
          <span className="hidden sm:inline ml-1 font-medium">FAQs</span>
        </Link>

        <Link
          href="/download"
          className="group relative inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-bold outline-none transition duration-300 focus:ring-2 focus:ring-rose-300/90 bg-stone-800 text-[#f5e5d5] shadow-xl shadow-stone-800/20 after:absolute after:inset-0 after:hidden after:rounded-2xl after:shadow-2xl after:shadow-orange-950/25 after:content-[''] sm:shadow-orange-950/25 sm:after:block pl-[3.25rem]"
          aria-label="Download for Mac"
        >
          <div className="ease absolute left-5 translate-x-0 opacity-100 transition duration-300 group-hover:-translate-x-full group-hover:scale-x-50 group-hover:opacity-0 group-hover:blur-sm">
            <svg
              className="h-5 w-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19.37 7.648c-.114.088-2.11 1.213-2.11 3.715 0 2.894 2.54 3.918 2.616 3.944-.011.062-.403 1.402-1.34 2.767-.834 1.201-1.706 2.4-3.032 2.4s-1.667-.77-3.198-.77c-1.492 0-2.022.796-3.235.796-1.214 0-2.06-1.112-3.033-2.477C4.911 16.42 4 13.93 4 11.566c0-3.791 2.465-5.802 4.891-5.802 1.29 0 2.364.847 3.173.847.77 0 1.972-.897 3.438-.897.556 0 2.553.05 3.867 1.934Zm-4.564-3.54c.607-.719 1.036-1.718 1.036-2.716 0-.138-.012-.279-.037-.392-.987.037-2.161.657-2.87 1.478-.555.632-1.074 1.63-1.074 2.643 0 .152.026.304.037.353.063.011.164.025.266.025.885 0 1.998-.593 2.642-1.39Z"></path>
            </svg>
          </div>
          <div className="ease translate-x-0 transition duration-300 group-hover:-translate-x-8 text-[#f5e5d5]">
            Download <span>for Mac</span>
          </div>
          <div className="ease absolute right-5 translate-x-full scale-x-50 opacity-0 blur-sm transition duration-300 group-hover:translate-x-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:blur-none">
            <svg
              className="h-5 w-5 fill-transparent stroke-current stroke-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
            </svg>
          </div>
        </Link>
      </nav>
    </header>
  );
}

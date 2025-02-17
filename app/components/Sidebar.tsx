// // app/components/layout/Sidebar.tsx
// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { cn } from '@/lib/utils';
// import { 
//   Home, 
//   ListTodo, 
//   Calendar, 
//   Settings, 
//   X 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface NavItem {
//   title: string;
//   href: string;
//   icon: React.ReactNode;
// }

// const navItems: NavItem[] = [
//   { title: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
//   { title: 'Tasks', href: '/tasks', icon: <ListTodo className="h-5 w-5" /> },
//   { title: 'Calendar', href: '/calendar', icon: <Calendar className="h-5 w-5" /> },
//   { title: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
// ];

// export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
//   const pathname = usePathname();

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
//           onClick={onClose}
//           aria-hidden="true"
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={cn(
//           "fixed top-16 bottom-0 left-0 z-50 w-64 border-r border-border bg-background transition-transform duration-300",
//           isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
//         )}
//       >
//         <div className="flex h-full flex-col">
//           {/* Mobile close button */}
//           <div className="flex h-16 items-center justify-end px-4 md:hidden">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={onClose}
//               aria-label="Close sidebar"
//             >
//               <X className="h-5 w-5" />
//             </Button>
//           </div>

//           {/* Navigation */}
//           <ScrollArea className="flex-1 px-4">
//             <nav className="flex flex-col gap-2">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={cn(
//                     "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
//                     "hover:bg-accent hover:text-accent-foreground",
//                     pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
//                     !isOpen && "md:justify-center"
//                   )}
//                 >
//                   {item.icon}
//                   <span className={cn(
//                     "transition-opacity duration-300",
//                     !isOpen && "md:hidden"
//                   )}>
//                     {item.title}
//                   </span>
//                 </Link>
//               ))}
//             </nav>
//           </ScrollArea>
//         </div>
//       </aside>
//     </>
//   );
// };

// app/components/layout/Sidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  ListTodo, 
  Calendar, 
  Settings, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
  { title: 'Tasks', href: '/tasks', icon: <ListTodo className="h-5 w-5" /> },
  { title: 'Calendar', href: '/calendar', icon: <Calendar className="h-5 w-5" /> },
  { title: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-50 w-64 border-r border-border bg-background transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex h-16 items-center justify-end px-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4">
            <nav className="flex flex-col gap-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    pathname === item.href 
                      ? "bg-accent text-accent-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground",
                    !isOpen && "md:justify-center md:px-3"
                  )}
                  role="menuitem"
                  tabIndex={0}
                >
                  <span className="relative flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span className={cn(
                    "transition-all duration-200",
                    !isOpen && "md:hidden",
                    pathname === item.href ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                  )}>
                    {item.title}
                  </span>
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
};
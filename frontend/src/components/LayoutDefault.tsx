import { AppSidebar } from '@/components/layoutsComponent/Sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { Outlet } from 'react-router'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeProvider'
import { Button } from '@/components/ui/button'

export default function LayoutDefault() {
    const { theme, toggleTheme } = useTheme();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col min-h-screen min-w-0 overflow-x-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 w-full">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Bill Pro
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Route</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="ml-auto">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleTheme}
                                className="h-9 w-9"
                            >
                                {theme === "light" ? (
                                    <Moon className="h-4 w-4" />
                                ) : (
                                    <Sun className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </header>
                <div className="flex-1 min-w-0 p-2">
                    <Outlet />
                </div>
                <footer className="bg-background py-3 px-4">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Bill Pro. All rights reserved.
                    </p>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    )
}

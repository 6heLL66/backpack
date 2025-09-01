import { useAuthStore } from '../../features/auth/store'
import { useNavigate, useLocation } from 'react-router'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Avatar,
} from '@heroui/react'

export const Tabs = () => {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const tabs = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/accounts', label: 'Accounts', icon: '👤' },
        { path: '/trade', label: 'Trade', icon: '📈' }
    ]

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <Navbar className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-xl">
            <NavbarBrand className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Backpack
                </h1>
            </NavbarBrand>
            
            <NavbarContent className="hidden sm:flex gap-3 justify-center flex-1" justify="center">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path
                    return (
                        <NavbarItem key={tab.path}>
                            <Button
                                variant={isActive ? "solid" : "light"}
                                color={isActive ? "primary" : "default"}
                                onPress={() => navigate(tab.path)}
                                className={`transition-all duration-200 px-3 py-3 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-indigo-400 hover:bg-gray-800/50'
                                }`}
                                startContent={<span className="text-lg mr-2">{tab.icon}</span>}
                            >
                                {tab.label}
                            </Button>
                        </NavbarItem>
                    )
                })}
            </NavbarContent>
            
            <NavbarContent justify="end" className="flex-shrink-0 ml-16">
                <div className="flex items-center space-x-4 mr-8">
                    <Avatar
                        name={user?.email?.charAt(0).toUpperCase() || 'U'}
                        className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium"
                    />
                    <div className="text-left">
                        <p className="font-medium text-gray-100 text-sm">{user?.email || 'User'}</p>
                        <p className="text-indigo-400 text-xs">Online</p>
                    </div>
                </div>

                <Button 
                    color='danger' 
                    onPress={handleLogout}
                    className="px-6 py-3"
                >
                    Logout
                </Button>
            </NavbarContent>
        </Navbar>
    )
}
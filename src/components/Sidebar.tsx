import { SidebarContent } from "./ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Dashboard as LayoutDashboard,
  Handshake as HandCoins,
  History,
  Calculate as Calculator,
  Settings,
  Security as Shield,
  Logout as LogOut
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const navigation = [
	{ name: "Dashboard", href: "/", icon: LayoutDashboard },
	{ name: "Loans", href: "/loans", icon: HandCoins },
	{ name: "Repayments", href: "/repayments", icon: History },
	{ name: "EMI Calculator", href: "/calculator", icon: Calculator },
];

function SidebarMenu() {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<SidebarContent className="bg-white md:bg-gradient-to-br md:from-blue-50 md:to-green-50 shadow-lg md:shadow-none">
			{/* Logo and Title */}
			<div className="flex items-center px-6 py-8 border-b border-gray-200">
				<div className="flex items-center space-x-3">
					<div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg">
						<Shield sx={{ fontSize: 24, color: 'white' }} />
					</div>
					<div>
						<h1 className="text-xl font-bold text-gray-900">MoneyBoard</h1>
						<p className="text-xs text-gray-500">Smart Lending Tracker</p>
					</div>
				</div>
			</div>
			{/* Navigation */}
			<nav className="flex-1 px-4 py-6 space-y-2">
				{navigation.map((item) => {
					const isActive = location.pathname === item.href;
					return (
						<Link
							key={item.name}
							to={item.href}
							className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
								isActive
									? "bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 border-l-4 border-blue-600"
									: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
							}`}
						>
							<item.icon sx={{ mr: 1.5, fontSize: 20, color: isActive ? 'primary.main' : 'text.secondary' }} />
							{item.name}
						</Link>
					);
				})}
			</nav>
			{/* User Profile & Footer */}
			<div className="px-4 py-4 border-t border-gray-200 space-y-2">
				<Link
					to="/settings"
					className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
				>
					<Settings sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
					Settings
				</Link>
				<button
					onClick={handleLogout}
					className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
				>
					<LogOut sx={{ mr: 1.5, fontSize: 20 }} />
					Logout
				</button>
			</div>
		</SidebarContent>
	);
}

export default SidebarMenu;

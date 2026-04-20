'use client';

import { useState, useEffect } from 'react';
import { products } from '@/lib/products';
import { Package, DollarSign, ShoppingBag, TrendingUp, Power } from 'lucide-react';
import { useSettingsStore } from '@/lib/store/settings';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const {
    shopEnabled,
    manualShopEnabled,
    scheduledClosureActive,
    toggleShop,
    fetchSettings,
  } = useSettingsStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setStoredPassword(password);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
      setStoredPassword('admin123');
    }
    fetchSettings();
  }, [fetchSettings]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="bg-muted p-8 rounded-lg">
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mb-4"
              placeholder="Enter admin password"
            />
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-light text-background font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Login
            </button>
            <p className="text-xs text-foreground/60 mt-4 text-center">
              Default password: admin123
            </p>
          </form>
        </div>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const inStock = products.filter(p => p.inventory === undefined || p.inventory > 0).length;
  const featured = products.filter(p => p.featured).length;

  const handleToggleShop = async () => {
    const success = await toggleShop(storedPassword);
    if (success) {
      toast.success('Shop preference updated (weekly Eastern schedule still applies when enabled).');
    } else {
      toast.error('Failed to update shop status');
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem('admin_auth');
            }}
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-muted p-6 rounded-lg mb-8 border-2 border-accent">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                <Power size={24} className="text-accent" />
                Shop Status
              </h2>
              <p className="text-foreground/70 text-sm mb-1">
                <span className="font-medium text-foreground">Visitors see shop: </span>
                {shopEnabled ? 'Open' : 'Closed'}
              </p>
              <p className="text-foreground/70 text-sm mb-1">
                <span className="font-medium text-foreground">Admin preference: </span>
                {manualShopEnabled ? 'Open' : 'Closed'}
              </p>
              <p className="text-foreground/70 text-sm">
                <span className="font-medium text-foreground">Weekly schedule: </span>
                {scheduledClosureActive
                  ? 'Closed (Fri 4:00 PM – Sat 11:00 PM Eastern)'
                  : 'Not in scheduled closure window'}
              </p>
              <p className="text-foreground/50 text-xs mt-2">
                Every Friday 4:00 PM ET the shop closes automatically until Saturday 11:00 PM ET, for all browsers. Manual toggle still applies outside that window.
              </p>
            </div>
            <button
              onClick={handleToggleShop}
              className={`px-6 py-3 rounded-lg font-medium transition-all shrink-0 ${
                manualShopEnabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {manualShopEnabled ? 'Set preference: Closed' : 'Set preference: Open'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-foreground/70">Total Products</h3>
              <Package className="text-accent" size={20} />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalProducts}</p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-foreground/70">Total Value</h3>
              <DollarSign className="text-accent" size={20} />
            </div>
            <p className="text-3xl font-bold text-foreground">${totalValue.toFixed(0)}</p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-foreground/70">In Stock</h3>
              <ShoppingBag className="text-accent" size={20} />
            </div>
            <p className="text-3xl font-bold text-foreground">{inStock}</p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-foreground/70">Featured</h3>
              <TrendingUp className="text-accent" size={20} />
            </div>
            <p className="text-3xl font-bold text-foreground">{featured}</p>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/70">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/70">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/70">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/70">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/70">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-sm text-foreground">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-foreground/70 capitalize">{product.category}</td>
                    <td className="py-3 px-4 text-sm text-foreground">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-foreground/70">
                      {product.inventory !== undefined ? product.inventory : '∞'}
                    </td>
                    <td className="py-3 px-4">
                      {product.featured && (
                        <span className="text-xs bg-accent text-background px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-muted rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Stripe Dashboard</h3>
              <p className="text-sm text-foreground/70 mb-3">
                View payments and manage transactions
              </p>
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-light text-sm font-medium"
              >
                Open Stripe →
              </a>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Product Management</h3>
              <p className="text-sm text-foreground/70 mb-3">
                Edit products in lib/products.ts
              </p>
              <span className="text-foreground/50 text-sm">Coming soon</span>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Order History</h3>
              <p className="text-sm text-foreground/70 mb-3">
                View all orders and customer details
              </p>
              <span className="text-foreground/50 text-sm">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

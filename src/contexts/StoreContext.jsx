import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, ADMIN_EMAIL, calculateDiscount } from '../config/supabase';

const NavigationContext = createContext();
export const useNavigation = () => useContext(NavigationContext);
export const NavigationProvider = ({ children }) => {
  const [view, setView] = useState('landing');
  return <NavigationContext.Provider value={{ view, setView }}>{children}</NavigationContext.Provider>;
};

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setView } = useNavigation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return <AuthContext.Provider value={{ user, isAdmin, loading, logout }}>{children}</AuthContext.Provider>;
};

const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);
export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('name');
    if (data) setProducts(data);
  };

  const fetchStatus = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'shop_status').single();
    if (data) setIsShopOpen(data.value?.isOpen ?? true);
  };

  useEffect(() => {
    fetchProducts();
    fetchStatus();
    const channel = supabase.channel('shop-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetchStatus)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const toggleShopStatus = async () => {
    const newVal = !isShopOpen;
    await supabase.from('settings').upsert({ id: 'shop_status', value: { isOpen: newVal } });
    setIsShopOpen(newVal);
  };

  return <ShopContext.Provider value={{ products, isShopOpen, toggleShopStatus, fetchProducts }}>{children}</ShopContext.Provider>;
};

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const { user, isAdmin } = useAuth();
  const { setView } = useNavigation();

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setMyOrders([]);
      return;
    }

    const loadOrders = async () => {
      if (isAdmin) {
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        setOrders(data || []);
      }
      const { data: userData } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setMyOrders(userData || []);
    };

    loadOrders();
    const channel = supabase.channel('order-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadOrders)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, isAdmin]);

  const updateCartQuantity = (product, delta) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta);
        if (newQty === 0) return prev.filter(item => item.id !== product.id);
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      }
      if (delta > 0) return [...prev, { ...product, quantity: 1 }];
      return prev;
    });
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (calculateDiscount(item.price, item.discount_percent) * item.quantity), 0), [cart]);

  const placeOrder = async (details, type) => {
    if (!user) return { error: "Session expired. Please log in." };
    const orderData = {
      customer_name: details.name,
      customer_phone: details.phone,
      address: details.address,
      items: cart,
      total_amount: cartTotal,
      order_type: type,
      status: 'Pending',
      user_id: user.id
    };
    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    if (!error) {
      setLastOrder(data);
      setCart([]);
      setIsCartOpen(false);
      setView('success');
    }
    return { error: error?.message };
  };

  const updateOrderStatus = async (orderId, status) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
  };

  return (
    <CartContext.Provider value={{ cart, isCartOpen, setIsCartOpen, updateCartQuantity, cartTotal, orders, myOrders, lastOrder, placeOrder, updateOrderStatus }}>
      {children}
    </CartContext.Provider>
  );
};

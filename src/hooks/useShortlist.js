/**
 * 💾 HOOK: useShortlist - ANONYMOUS PERSISTENCE
 */
"use client";
import { useState, useEffect } from 'react';
import { marketplaceFeedback } from '@/services/marketplace/MarketplaceFeedbackService';
export const useShortlist = () => {
    const [items, setItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('ear_os_shortlist');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            }
            catch (e) {
                console.error("Shortlist corruption detected, resetting...");
                localStorage.removeItem('ear_os_shortlist');
            }
        }
        setIsInitialized(true);
    }, []);
    // Sync to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('ear_os_shortlist', JSON.stringify(items));
        }
    }, [items, isInitialized]);
    const addToShortlist = (service) => {
        if (items.some(i => i.id === service.id))
            return;
        const newItem = {
            ...service,
            addedAt: new Date().toISOString()
        };
        setItems(prev => [...prev, newItem]);
        marketplaceFeedback.track('shortlist_added', {
            serviceId: service.serviceId,
            priceSnapshot: parseFloat(service.price.replace(/[^\d.]/g, ''))
        });
    };
    const removeFromShortlist = (id) => {
        const item = items.find(i => i.id === id);
        setItems(prev => prev.filter(i => i.id !== id));
        if (item) {
            marketplaceFeedback.track('shortlist_removed', {
                serviceId: item.serviceId
            });
        }
    };
    return {
        items,
        addToShortlist,
        removeFromShortlist,
        count: items.length
    };
};

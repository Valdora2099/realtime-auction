import React from 'react';

/**
 * BrandLogo — the BidPulse logo image + wordmark.
 *
 * Props:
 *   size   — logo image size in px (default 32)
 *   showText — whether to show "BidPulse" wordmark (default true)
 *   className — wrapper class
 */
const BrandLogo = ({ size = 32, showText = true, className = '' }) => (
    <div className={`brand-logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
            src="/logo.png"
            alt="BidPulse"
            width={size}
            height={size}
            style={{
                borderRadius: Math.round(size * 0.28) + 'px',
                boxShadow: '0 2px 12px rgba(108,99,255,0.35)',
                flexShrink: 0,
                objectFit: 'cover',
            }}
        />
        {showText && (
            <span style={{
                fontSize: size < 28 ? '16px' : '20px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(135deg, #a78bfa, #e2e0ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
            }}>
                BidPulse
            </span>
        )}
    </div>
);

export default BrandLogo;

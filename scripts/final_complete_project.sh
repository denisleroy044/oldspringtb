#!/bin/bash

# Complete Project Setup Matching Your Model Pages

set -e

echo "🏦 Setting up Complete Banking Platform from Your Models"
echo "========================================================"

# Create all necessary directories
mkdir -p src/app
mkdir -p src/app/user
mkdir -p src/app/auth/login
mkdir -p src/app/auth/signup
mkdir -p src/app/auth/forgot-password
mkdir -p src/app/dashboard
mkdir -p src/app/about
mkdir -p src/app/borrow
mkdir -p src/app/save
mkdir -p src/app/invest
mkdir -p src/app/insure
mkdir -p src/app/learn-and-plan
mkdir -p src/app/payments
mkdir -p src/app/business-banking
mkdir -p src/app/credit-cards
mkdir -p src/app/customer-support
mkdir -p src/app/faqs
mkdir -p src/app/giving-back
mkdir -p src/app/news
mkdir -p src/app/privacy-policy
mkdir -p src/app/careers
mkdir -p src/app/how-to-save-for-summer-vacation
mkdir -p src/app/simple-ways-to-manage-a-checking-account
mkdir -p src/app/tax-checklist-5-things-to-remember
mkdir -p src/app/the-impact-of-rising-rates-and-inflation-on-your-business
mkdir -p src/components/layout
mkdir -p src/components/ui

# ============================================
# GLOBAL CSS - EXACT STYLES FROM MODEL
# ============================================
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-blue: #011f4c;
  --primary-navy: #1e3a5f;
  --accent-gold: #e68a2e;
  --light-bg: #f8f9fa;
  --border-color: #e5e7eb;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #333;
  line-height: 1.6;
  background: white;
}

/* Container */
.l-contain, .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Styles */
.l-header {
  background: white;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.l-header__bottom {
  padding: 15px 0;
}

.l-header__logo img {
  max-height: 60px;
  width: auto;
}

.l-header__action__l1 {
  display: flex;
  list-style: none;
  gap: 10px;
}

.l-header__action__l1 a {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.l-header__action__l1 li:first-child a {
  background: var(--primary-navy);
  color: white;
}

.l-header__action__l1 li:first-child a:hover {
  background: #2b4c7a;
}

.l-header__action__l1 li:last-child a {
  border: 2px solid var(--primary-navy);
  color: var(--primary-navy);
}

.l-header__action__l1 li:last-child a:hover {
  background: var(--primary-navy);
  color: white;
}

.header__routing {
  font-weight: 600;
  color: var(--primary-navy);
  margin-right: 20px;
}

/* Navigation */
.nav-primary__l1 {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
}

.nav-primary__l1-item {
  position: relative;
}

.nav-primary__l1-item-link {
  display: block;
  padding: 10px 0;
  color: #4a5568;
  font-weight: 500;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.3s;
}

.nav-primary__l1-item-link:hover {
  color: var(--primary-navy);
}

.nav-primary__flyout {
  position: absolute;
  top: 100%;
  left: 0;
  width: 600px;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 25px;
  display: none;
  z-index: 100;
}

.nav-primary__l1-item:hover .nav-primary__flyout {
  display: block;
}

.nav-primary__flyout-nav {
  margin-bottom: 20px;
}

.nav-primary__flyout-nav-title {
  font-size: 18px;
  color: var(--primary-navy);
  margin-bottom: 15px;
  font-weight: 600;
}

.nav-primary__l2 {
  list-style: none;
  padding: 0;
}

.nav-primary__l2-item {
  margin-bottom: 10px;
}

.nav-primary__l2-item-link {
  color: #4a5568;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.nav-primary__l2-item-link:hover {
  color: var(--primary-navy);
}

.nav-primary__flyout-feature {
  background: #f0f9ff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 15px;
}

.nav-primary__flyout-feature-title {
  color: var(--primary-navy);
  font-weight: 600;
  margin-bottom: 10px;
  display: block;
}

.nav-primary__flyout-feature-desc {
  color: #4a5568;
  font-size: 14px;
  margin-bottom: 10px;
}

.nav-primary__flyout-feature-cta {
  color: var(--primary-navy);
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
}

/* Header Contacts */
.l-header__nav-contacts {
  display: flex;
  gap: 20px;
  margin-left: 20px;
}

.l-header__nav-contacts__item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.l-header__nav-contacts__item-hours {
  font-size: 13px;
  color: #6b7280;
}

.l-header__nav-contacts__item-hours dt,
.l-header__nav-contacts__item-hours dd {
  display: inline;
}

.l-header__nav-contacts__item-cta a {
  color: var(--primary-navy);
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Hero Section */
.main-hero {
  position: relative;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  color: white;
}

.main-hero__content {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  padding: 0 20px;
}

.main-hero__title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
}

.main-hero__subtitle {
  font-size: 24px;
  font-weight: 400;
  max-width: 800px;
  line-height: 1.4;
}

/* Static Strip */
.static-strip {
  background: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 15px 0;
}

.static-strip__inner ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
}

.static-strip__routing-num {
  font-weight: 600;
  color: var(--primary-navy);
  font-size: 16px;
}

.static-strip__dropup {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.static-strip__hours {
  margin-bottom: 15px;
}

.static-strip__hours dt,
.static-strip__hours dd {
  display: inline;
  font-size: 14px;
}

.button--navy-outline {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid var(--primary-navy);
  color: var(--primary-navy);
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.button--navy-outline:hover {
  background: var(--primary-navy);
  color: white;
}

/* Tabbed Feature */
.tabbed-feature {
  padding: 60px 0;
  background: white;
}

.tabbed-feature__tabs {
  display: flex;
  list-style: none;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 30px;
}

.tabbed-feature__tabs li {
  margin-right: 30px;
}

.tabbed-feature__tabs a {
  display: block;
  padding: 10px 0;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s;
}

.tabbed-feature__tabs a:hover {
  color: var(--primary-navy);
  border-bottom-color: var(--primary-navy);
}

/* Rates Hero */
.rates-hero__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.rates-hero__rate {
  text-align: center;
}

.rates-hero__rate-amt {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-navy);
  margin-bottom: 5px;
}

.rates-hero__rate-amt span {
  font-size: 14px;
  color: #6b7280;
  font-weight: 400;
  margin-left: 4px;
}

.rates-hero__rate-pre {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 5px;
}

.rates-hero__rate-desc {
  display: block;
  color: var(--primary-navy);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 5px;
}

.rates-hero__rate-card {
  font-size: 12px;
  color: #6b7280;
}

.rates-hero__rate-note {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 5px;
}

/* Section Links */
.section-links {
  padding: 60px 0;
  background: var(--light-bg);
}

.section-links__title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-navy);
  margin-bottom: 50px;
}

.section-links__item {
  text-align: center;
}

.section-links__item a {
  display: block;
  text-decoration: none;
  color: #4a5568;
  transition: color 0.3s;
}

.section-links__item a:hover {
  color: var(--primary-navy);
}

.section-links__item img {
  margin: 0 auto 15px;
  width: 85px;
  height: 85px;
}

.link-chevron {
  font-size: 14px;
  font-weight: 500;
}

/* Campaign Feature */
.campaign-feature {
  padding: 60px 0;
  background: white;
}

.campaign-feature__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.campaign-feature__meta-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-navy);
  margin-bottom: 20px;
  line-height: 1.3;
}

.campaign-feature__meta-text {
  font-size: 18px;
  color: #4a5568;
  line-height: 1.6;
}

/* Related Content */
.related-content {
  padding: 60px 0;
  background: var(--light-bg);
}

.related-content__title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-navy);
  margin-bottom: 50px;
}

.related-content__items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.related-content__item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.related-content__item-meta {
  padding: 25px;
}

.related-content__item-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.related-content__item-title a {
  color: var(--primary-navy);
  text-decoration: none;
}

.related-content__item-label {
  display: inline-block;
  font-size: 12px;
  color: var(--accent-gold);
  text-decoration: none;
  margin-bottom: 10px;
}

.related-content__item-excerpt {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.related-content__item-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* Why Hero */
.why-hero {
  padding: 60px 0;
  background: var(--primary-navy);
  color: white;
}

.why-hero__title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 40px;
}

.quote {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.quote__body {
  font-size: 24px;
  font-style: italic;
  margin-bottom: 20px;
}

.quote__author {
  font-size: 18px;
  color: var(--accent-gold);
}

/* Footer Top */
.l-footer__top {
  background: var(--primary-navy);
  color: white;
  padding: 40px 0;
}

.footer-quick-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.footer-quick-bar__item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.footer-quick-bar__item img {
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
}

.footer-quick-bar__item-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}

.footer-quick-bar__item-header a {
  color: white;
  text-decoration: none;
}

.footer-quick-bar__item-subtitle {
  font-size: 14px;
  color: #e5e7eb;
}

.footer-quick-bar__text .weight-reg {
  font-weight: 400;
  color: #e5e7eb;
}

/* Main Footer */
.l-footer {
  background: #111827;
  color: white;
  padding: 60px 0 30px;
}

.l-footer-main {
  margin-bottom: 40px;
}

.l-footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 50px;
}

.footer-about__header {
  font-size: 20px;
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: 20px;
}

.footer-about__info {
  color: #9ca3af;
  line-height: 1.7;
  font-size: 14px;
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
}

.footer-nav__col1,
.footer-nav__col2 {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer-nav__links {
  list-style: none;
}

.footer-nav__item {
  margin-bottom: 10px;
}

.footer-nav__link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-nav__link:hover {
  color: white;
}

.footer-services__header {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: 20px;
}

.footer-services__nav {
  list-style: none;
  margin-bottom: 30px;
}

.footer-services__nav-item {
  margin-bottom: 10px;
}

.footer-services__nav-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-services__nav-link:hover {
  color: white;
}

/* Footer Bottom */
.l-footer__bottom {
  border-top: 1px solid #374151;
  padding-top: 30px;
}

.footer-site-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-site-links__left {
  display: flex;
  gap: 20px;
}

.footer-site-links__link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-site-links__link:hover {
  color: white;
}

.footer-site-links__right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.footer-site-links__right img {
  height: 30px;
  width: auto;
}

/* Sub Hero */
.l-sub-hero {
  position: relative;
  min-height: 400px;
  background-size: cover;
  background-position: center;
}

.sub-hero-content {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  color: white;
}

.sub-hero__title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
}

.sub-hero__teaser {
  font-size: 24px;
  max-width: 800px;
  line-height: 1.4;
}

/* Navigation Secondary */
.l-nav-secondary {
  background: white;
  border-bottom: 1px solid var(--border-color);
  padding: 15px 0;
}

.nav-secondary__l1 {
  display: flex;
  list-style: none;
}

.nav-secondary__l1-item {
  margin-right: 30px;
}

.nav-secondary__l1-item button {
  background: none;
  border: none;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-secondary__l1-item span {
  color: var(--primary-navy);
  font-weight: 600;
}

/* Tiles */
.tiles {
  margin: 40px 0;
}

.tiles__inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.tile {
  display: block;
  padding: 30px;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.tile:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

.tile__heading {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-navy);
  margin-bottom: 15px;
}

.tile__body {
  color: #4a5568;
  font-size: 14px;
  line-height: 1.6;
}

/* Quick Bar */
.quick-bar {
  margin: 40px 0;
}

.quick-bar__wrap {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.quick-bar__item {
  display: block;
  text-align: center;
  text-decoration: none;
  color: #4a5568;
  transition: color 0.3s;
}

.quick-bar__item:hover {
  color: var(--primary-navy);
}

.quick-bar__item img {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
}

.quick-bar__item-header {
  font-size: 16px;
  font-weight: 600;
}

/* Join CTA */
.l-join-cta {
  margin: 40px 0;
}

.join-cta {
  padding: 60px 0;
  background: var(--primary-navy);
  color: white;
}

.join-cta--primary {
  background: var(--primary-navy);
}

.join-cta--secondary {
  background: var(--accent-gold);
  color: var(--primary-navy);
}

.join-cta__title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
}

.join-cta__link {
  display: inline-block;
  padding: 12px 30px;
  background: white;
  color: var(--primary-navy);
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background 0.3s;
}

.join-cta__link:hover {
  background: #f3f4f6;
}

/* Related Links */
.related-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 40px 0;
}

.related-links__title {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-navy);
  margin-bottom: 20px;
}

.related-links__item {
  text-decoration: none;
  color: inherit;
}

.related-links__item-category {
  font-size: 12px;
  color: var(--accent-gold);
  margin-bottom: 10px;
}

.related-links__item-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-navy);
  margin-bottom: 10px;
}

.related-links__item-caption {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

/* FAQ */
.faq__item {
  border-bottom: 1px solid var(--border-color);
}

.faq__question {
  display: block;
  padding: 20px;
  color: var(--primary-navy);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.faq__answer {
  padding: 0 20px 20px;
  color: #4a5568;
}

/* Product List */
.product-list-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
}

.product-list-item__name {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-navy);
  text-decoration: none;
}

.product-list-item-inner {
  display: grid;
  grid-template-columns: 120px 1fr 120px 1fr 200px;
  gap: 20px;
  align-items: center;
  margin-top: 15px;
}

.product-list-item__rate {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-navy);
}

.product-list-item__apr {
  font-size: 12px;
  color: #6b7280;
}

.product-list-item__btn {
  display: inline-block;
  padding: 8px 16px;
  background: var(--primary-navy);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.3s;
}

.product-list-item__btn:hover {
  background: #2b4c7a;
}

/* Auth Pages */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.auth-logo {
  text-align: center;
  margin-bottom: 30px;
}

.auth-logo img {
  height: 50px;
  width: auto;
}

.auth-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.auth-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .nav-primary__l1 {
    gap: 15px;
  }
  
  .rates-hero__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tiles__inner {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-quick-bar {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .l-footer-inner {
    grid-template-columns: 1fr;
  }
  
  .footer-site-links {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .main-hero__title {
    font-size: 32px;
  }
  
  .main-hero__subtitle {
    font-size: 18px;
  }
  
  .rates-hero__grid {
    grid-template-columns: 1fr;
  }
  
  .campaign-feature__inner {
    grid-template-columns: 1fr;
  }
  
  .related-content__items {
    grid-template-columns: 1fr;
  }
  
  .tiles__inner {
    grid-template-columns: 1fr;
  }
  
  .quick-bar__wrap {
    grid-template-columns: 1fr;
  }
  
  .footer-quick-bar {
    grid-template-columns: 1fr;
  }
  
  .footer-nav {
    grid-template-columns: 1fr;
  }
  
  .product-list-item-inner {
    grid-template-columns: 1fr;
  }
}
EOF

# ============================================
# HEADER COMPONENT
# ============================================
cat > src/components/layout/Header.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [branchHoursOpen, setBranchHoursOpen] = useState(false)
  const pathname = usePathname()

  // Don't show header on dashboard or auth pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth') || pathname?.startsWith('/user')) {
    return null
  }

  return (
    <header id="header" className="l-header">
      <div className="l-header__bottom">
        <div id="header-inner" className="l-header__bottom-inner l-contain">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="l-header__logo">
              <img 
                src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
                alt="Oldspring Trust Bank"
                width="200"
              />
            </Link>

            {/* Desktop Actions */}
            <div className="l-header__action hidden md:block">
              <ul className="l-header__action__l1">
                <li className="is-active">
                  <Link href="/auth/login">LOGIN</Link>
                </li>
                <li>
                  <Link href="/auth/signup">OPEN ACCOUNT</Link>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between mt-4">
            <span className="header__routing">Routing # 655205039</span>

            <nav id="nav-personal" className="nav-primary">
              <ul className="nav-primary__l1">
                <li className="nav-primary__l1-item">
                  <Link href="/" className="nav-primary__l1-item-link">Home</Link>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="#" className="nav-primary__l1-item-link">Bank</Link>
                  <div className="nav-primary__flyout">
                    <div className="nav-primary__flyout-nav">
                      <div className="nav-primary__flyout-nav-title">Bank</div>
                      <ul className="nav-primary__l2">
                        <li className="nav-primary__l2-item">
                          <Link href="#" className="nav-primary__l2-item-link">Oldspring Trust Accounts</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/credit-cards" className="nav-primary__l2-item-link">Credit Cards</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="#" className="nav-primary__l2-item-link">Online & Mobile Banking</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/about" className="nav-primary__l2-item-link">Why Bank with Oldspring Trust?</Link>
                        </li>
                      </ul>
                    </div>
                    <div className="nav-primary__flyout-feature">
                      <span className="nav-primary__flyout-feature-title">Get rewards on Us</span>
                      <div className="nav-primary__flyout-feature-desc">
                        <p>For a limited time, get a reward when you bank with us! Additional terms apply.</p>
                      </div>
                      <Link href="#" className="nav-primary__flyout-feature-cta">Learn More</Link>
                    </div>
                  </div>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/save" className="nav-primary__l1-item-link">Save</Link>
                  <div className="nav-primary__flyout">
                    <div className="nav-primary__flyout-nav">
                      <div className="nav-primary__flyout-nav-title">Save</div>
                      <ul className="nav-primary__l2">
                        <li className="nav-primary__l2-item">
                          <Link href="/save#HighYieldSavings" className="nav-primary__l2-item-link">High Yield Savings</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/save#StarSavings" className="nav-primary__l2-item-link">Star Savings</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/save#Certificates" className="nav-primary__l2-item-link">Certificates</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/save#HolidayClub" className="nav-primary__l2-item-link">Holiday Club</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/save#MoneyMarket" className="nav-primary__l2-item-link">Money Market</Link>
                        </li>
                      </ul>
                    </div>
                    <div className="nav-primary__flyout-feature">
                      <span className="nav-primary__flyout-feature-title">Certificates</span>
                      <div className="nav-primary__flyout-feature-desc">
                        <p>Build your savings with a low-risk, fixed rate.* Additional terms apply.</p>
                      </div>
                      <Link href="/save#Certificates" className="nav-primary__flyout-feature-cta">Learn More</Link>
                    </div>
                  </div>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/borrow" className="nav-primary__l1-item-link">Borrow</Link>
                  <div className="nav-primary__flyout">
                    <div className="nav-primary__flyout-nav">
                      <div className="nav-primary__flyout-nav-title">Borrow</div>
                      <ul className="nav-primary__l2">
                        <li className="nav-primary__l2-item">
                          <Link href="/borrow#creditcard" className="nav-primary__l2-item-link">Credit Cards</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/borrow#mortgage" className="nav-primary__l2-item-link">Mortgage & Home Loan</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/borrow#personal" className="nav-primary__l2-item-link">Personal Loans</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/borrow#auto" className="nav-primary__l2-item-link">Auto Loans</Link>
                        </li>
                        <li className="nav-primary__l2-item">
                          <Link href="/borrow#student" className="nav-primary__l2-item-link">Student Loans</Link>
                        </li>
                      </ul>
                    </div>
                    <div className="nav-primary__flyout-feature">
                      <span className="nav-primary__flyout-feature-title">0% Intro APR* for 15 Months</span>
                      <div className="nav-primary__flyout-feature-desc">
                        <p>Pay no interest until 2025 on all purchases with a new credit card.</p>
                      </div>
                      <Link href="/borrow#creditcard" className="nav-primary__flyout-feature-cta">Learn More</Link>
                    </div>
                  </div>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/invest" className="nav-primary__l1-item-link">Wealth & Retire</Link>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/insure" className="nav-primary__l1-item-link">Insure</Link>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/learn-and-plan" className="nav-primary__l1-item-link">Learn & Plan</Link>
                </li>
                <li className="nav-primary__l1-item">
                  <Link href="/payments" className="nav-primary__l1-item-link">Payments</Link>
                </li>
              </ul>
            </nav>

            <div className="l-header__nav-contacts">
              <div className="l-header__nav-contacts__item">
                <p className="l-header__nav-contacts__item-title">
                  <img src="/templates/bank-pro/images/assets/ico-clock.svg" width="30" height="30" alt="" />
                  Branch Hours
                </p>
                <dl className="l-header__nav-contacts__item-hours">
                  <dt>Mon-Thurs</dt>
                  <dd>8:30 a.m.-5:00 p.m.</dd>
                  <dt>Friday:</dt>
                  <dd>8:30 a.m.-6:00 p.m.</dd>
                  <dt>Saturday:</dt>
                  <dd>9:00 a.m.-1:00 p.m.</dd>
                </dl>
              </div>
              <div className="l-header__nav-contacts__item">
                <p className="l-header__nav-contacts__item-title">
                  <img src="/templates/bank-pro/prefooter-icons/ico-star-circle.svg" width="30" height="30" alt="" />
                  Customer Service
                </p>
                <p className="l-header__nav-contacts__item-cta">
                  <a href="mailto:support@oldspringtrust.com">
                    <img src="/templates/bank-pro/icons/footer-icons/call-citadel-credit-union.svg" width="15" height="15" alt="" />
                    support@oldspringtrust.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t mt-4">
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="py-2 text-gray-700">Home</Link>
                <Link href="/bank" className="py-2 text-gray-700">Bank</Link>
                <Link href="/save" className="py-2 text-gray-700">Save</Link>
                <Link href="/borrow" className="py-2 text-gray-700">Borrow</Link>
                <Link href="/invest" className="py-2 text-gray-700">Wealth & Retire</Link>
                <Link href="/insure" className="py-2 text-gray-700">Insure</Link>
                <Link href="/learn-and-plan" className="py-2 text-gray-700">Learn & Plan</Link>
                <Link href="/payments" className="py-2 text-gray-700">Payments</Link>
                <div className="pt-4 border-t flex flex-col space-y-2">
                  <Link href="/auth/login" className="bg-[#1e3a5f] text-white px-4 py-2 rounded text-center">LOGIN</Link>
                  <Link href="/auth/signup" className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-4 py-2 rounded text-center">OPEN ACCOUNT</Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
EOF

# ============================================
# FOOTER COMPONENT
# ============================================
cat > src/components/layout/Footer.tsx << 'EOF'
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  // Don't show footer on dashboard or auth pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth') || pathname?.startsWith('/user')) {
    return null
  }

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    alert('Temporarily unavailable, please contact us via Email')
  }

  return (
    <>
      <div className="l-footer__top">
        <div className="footer-quick-bar l-contain">
          <div className="footer-quick-bar__item">
            <img src="/templates/bank-pro/icons/footer-icons/citadel-credit-union-routing-number.svg" alt="" />
            <div className="footer-quick-bar__text">
              <h2 className="footer-quick-bar__item-header">Routing #</h2>
              <h3 className="footer-quick-bar__item-subtitle">655205039</h3>
            </div>
          </div>
          <div className="footer-quick-bar__item">
            <img src="/templates/bank-pro/icons/prefooter-icons/icoclock.png" alt="" />
            <div className="footer-quick-bar__text">
              <h2 className="footer-quick-bar__item-header">Branch Hours: <span className="weight-reg">Mon - Thurs: 8:30 a.m.-5:00 p.m.</span></h2>
              <h2 className="footer-quick-bar__item-header">Friday: <span className="weight-reg">8:30 a.m.-6:00 p.m.</span></h2>
              <h2 className="footer-quick-bar__item-header">Saturday: <span className="weight-reg">9:00 a.m.-1:00 p.m.</span></h2>
            </div>
          </div>
          <div className="footer-quick-bar__item">
            <img src="/templates/bank-pro/icons/footer-icons/call-citadel-credit-union.svg" alt="" />
            <div className="footer-quick-bar__text">
              <h2 className="footer-quick-bar__item-header">
                <a href="mailto:support@oldspringtrust.com">support@oldspringtrust.com</a>
              </h2>
              <h3 className="footer-quick-bar__item-subtitle">Customer Service</h3>
            </div>
          </div>
          <div className="footer-quick-bar__item">
            <img src="/templates/bank-pro/footer-images/live-video-call.png" alt="" />
            <div className="footer-quick-bar__text">
              <h2 className="footer-quick-bar__item-header">
                <a href="#" onClick={handleVideoClick}>Video Connect</a>
              </h2>
              <h3 className="footer-quick-bar__item-subtitle">Chat Virtually</h3>
            </div>
          </div>
        </div>
      </div>

      <footer className="l-footer">
        <div className="l-footer-main">
          <div className="l-footer-inner l-contain">
            <div className="l-footer-inner--left">
              <div className="l-footer__about">
                <div className="footer-about">
                  <h2 className="footer-about__header">Building Strength Together</h2>
                  <p className="footer-about__info">
                    Oldspring Trust is a not-for-profit credit union bank built on the unshakeable promise to serve those who work every day to build a better future for us all. For over 80 years, we've delivered a breadth of financial services, expert guidance, and innovative tools to help strengthen and grow businesses, families, and our local communities. We are your Oldspring Trust, and we are Building Strength Together.
                  </p>
                </div>
              </div>

              <div className="l-footer__nav">
                <div className="footer-nav">
                  <div className="footer-nav__col1">
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><Link href="/about" className="footer-nav__link">About Oldspring Trust</Link></li>
                      <li className="footer-nav__item"><Link href="/about" className="footer-nav__link">Who we are</Link></li>
                      <li className="footer-nav__item"><Link href="/customer-support" className="footer-nav__link">Contact Us</Link></li>
                    </ul>
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><Link href="/news" className="footer-nav__link">News & Events</Link></li>
                      <li className="footer-nav__item"><Link href="/news" className="footer-nav__link">Latest News</Link></li>
                    </ul>
                  </div>
                  <div className="footer-nav__col2">
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><Link href="/careers" className="footer-nav__link">Careers</Link></li>
                      <li className="footer-nav__item"><Link href="/careers" className="footer-nav__link">Get Started</Link></li>
                    </ul>
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><Link href="/giving-back" className="footer-nav__link">Giving Back</Link></li>
                      <li className="footer-nav__item"><Link href="/giving-back" className="footer-nav__link">Oldspring Trust Charity</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="l-footer-inner--right">
              <div className="l-footer__services">
                <div className="footer-services">
                  <h2 className="footer-services__header"><Link href="#">Member Services</Link></h2>
                  <ul className="footer-services__nav">
                    <li className="footer-services__nav-item"><Link href="/payments" className="footer-services__nav-link">Loan Payments</Link></li>
                    <li className="footer-services__nav-item"><Link href="#" className="footer-services__nav-link">Referral Service</Link></li>
                    <li className="footer-services__nav-item"><Link href="#" className="footer-services__nav-link">Oldspring Trust Security™</Link></li>
                    <li className="footer-services__nav-item"><a href="mailto:support@oldspringtrust.com" className="footer-services__nav-link">Email Us</a></li>
                  </ul>
                  <img src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" width="255" alt="Oldspring Trust" />
                  <hr className="my-4 border-gray-700" />
                  <div className="footer-nav__col1">
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><Link href="#" className="footer-nav__link">Location</Link></li>
                      <li className="footer-nav__item"><Link href="#" className="footer-nav__link">100 Bishopsgate, London EC2N 4AG, United Kingdom</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="l-footer__bottom">
          <div className="l-footer__site-links">
            <div className="footer-site-links l-contain">
              <div className="footer-site-links__left">
                <Link href="/privacy-policy" className="footer-site-links__link">Privacy Policy</Link>
                <Link href="/faqs" className="footer-site-links__link">FAQs</Link>
                <Link href="#" className="footer-site-links__link">Sitemap</Link>
              </div>
              <div className="footer-site-links__right">
                <img src="/templates/bank-pro/blue-seal-200-42-bbb-80015515.png" alt="BBB" />
                <img src="/templates/bank-pro/images/assets/ncua-lender.png" alt="NCUA Lender" />
                <img src="/templates/bank-pro/images/assets/ncua-cert.png" alt="NCUA Certified" />
                <span className="text-xs text-gray-400">Federally Insured by NCUA</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
EOF

# ============================================
# ROOT LAYOUT
# ============================================
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Oldspring Trust Bank - Mobile Banking, Credit Cards, Mortgages, Auto Loan',
  description: 'Mobile Banking, Credit Cards, Mortgages, Auto Loan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
EOF

# ============================================
# HOMEPAGE - EXACT MATCH TO INDEX.PHP
# ============================================
cat > src/app/page.tsx << 'EOF'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="main-hero main-hero--home hero--image" aria-label="Hero Area">
        <div className="main-hero__image">
          <div className="image-hero">
            <div 
              className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-6"
              style={{ 
                backgroundImage: "url('/templates/bank-pro/homepage-images/metro.jpg')",
                height: '600px',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </div>
        </div>

        <div className="main-hero__container">
          <div className="main-hero__content l-contain">
            <div className="main-hero__header">
              <p className="main-hero__title">Oldspring Trust Bank</p>
              <p className="main-hero__subtitle">
                We do banking differently. We believe that people come first, and that everyone deserves a great experience every step of the way – whether it's face to face, over the phone, online or on our app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Static Strip */}
      <section className="static-strip" aria-label="Branch Information">
        <div className="static-strip__inner l-contain">
          <ul>
            <li className="static-strip__routing-num">
              Routing # <br /> 655205039
            </li>
            <li>
              <a href="javascript:;" data-toggle="branch-hours__dropup">
                <span className="icon">
                  <img src="/templates/bank-pro/static-strip-icons/ico-clock-new.svg" width="38" height="38" alt="" />
                </span>
                Branch Hours
              </a>
              <div id="branch-hours__dropup" className="static-strip__dropup">
                <dl className="static-strip__hours">
                  <dt>Mon-Thurs</dt>
                  <dd>8:30 a.m.-5:00 p.m.</dd>
                  <dt>Friday:</dt>
                  <dd>8:30 a.m.-6:00 p.m.</dd>
                  <dt>Saturday:</dt>
                  <dd>9:00 a.m.-1:00 p.m.</dd>
                </dl>
                <a className="button--navy-outline" href="mailto:support@oldspringtrust.com">Schedule an Appointment</a>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Tabbed Feature - Rates */}
      <section id="tabbed-feature" className="tabbed-feature" aria-label="Find Your Branch">
        <div className="l-contain">
          <div className="tabbed-feature__inner">
            <ul id="tabbed-feature-nav" className="tabbed-feature__tabs">
              <li className="tabs-title">
                <a href="#">Oldspring Trust Rates</a>
              </li>
              <li className="tabs-title">
                <a href="#">Oldspring Trust Member Care</a>
              </li>
            </ul>

            <div className="rates-hero">
              <div className="rates-hero__grid">
                <div className="rates-hero__grid-item">
                  <div className="rates-hero__rate">
                    <div className="rates-hero__rate-amt">3.75%<span>APY</span></div>
                    <a href="#" className="rates-hero__rate-desc">High Yield Savings Account</a>
                    <div className="rates-hero__rate-card">High Yield Savings Rate</div>
                  </div>
                </div>
                <div className="rates-hero__grid-item">
                  <div className="rates-hero__rate">
                    <div className="rates-hero__rate-amt">3.65%<span>APY</span></div>
                    <a href="#" className="rates-hero__rate-desc">18 Month Certificate</a>
                    <div className="rates-hero__rate-card">Oldspring Trust Standard Certificate Rates</div>
                  </div>
                </div>
                <div className="rates-hero__grid-item">
                  <div className="rates-hero__rate">
                    <div className="rates-hero__rate-amt">4.00%<span>APY</span></div>
                    <a href="#" className="rates-hero__rate-desc">36 Month Certificate</a>
                    <div className="rates-hero__rate-card">Oldspring Trust Standard Certificate Rates</div>
                  </div>
                </div>
                <div className="rates-hero__grid-item">
                  <div className="rates-hero__rate">
                    <div className="rates-hero__rate-pre">AS LOW AS</div>
                    <div className="rates-hero__rate-amt">15.49%<span>APR</span></div>
                    <a href="#" className="rates-hero__rate-desc">Cash Rewards Mastercard</a>
                    <div className="rates-hero__rate-card">Mastercard</div>
                    <div className="rates-hero__rate-note">variable APR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Links - How Can We Help */}
      <section className="section-links" aria-labelledby="section-links--default__title">
        <div className="l-contain">
          <h2 id="section-links--default__title" className="section-links__title">How Can We Help You Today?</h2>
          <div className="grid-x grid-padding-x grid-padding-y grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="section-links__item">
              <Link href="/">
                <img src="/templates/bank-pro/section-links/ico-check-account.svg" width="85" height="85" alt="open an account" />
                <span className="link-chevron">Instant Accounts</span>
              </Link>
            </div>
            <div className="section-links__item">
              <Link href="/credit-cards">
                <img src="/templates/bank-pro/section-links/ico-credit-cards.svg" width="85" height="85" alt="Credit Cards" />
                <span className="link-chevron">Credit Cards</span>
              </Link>
            </div>
            <div className="section-links__item">
              <Link href="/borrow">
                <img src="/templates/bank-pro/section-links/ico-loans.svg" width="85" height="85" alt="Loans" />
                <span className="link-chevron">Loans</span>
              </Link>
            </div>
            <div className="section-links__item">
              <Link href="/business-banking">
                <img src="/templates/bank-pro/section-links/ico-businessbanking.svg" width="85" height="85" alt="business banking" />
                <span className="link-chevron">Business Banking</span>
              </Link>
            </div>
            <div className="section-links__item">
              <Link href="/invest">
                <img src="/templates/bank-pro/section-links/ico-invest.svg" width="85" height="85" alt="Invest" />
                <span className="link-chevron">Wealth & Retire</span>
              </Link>
            </div>
            <div className="section-links__item">
              <Link href="/about">
                <img src="/templates/bank-pro/section-links/ico-about.svg" width="85" height="85" alt="About Oldspring Trust" />
                <span className="link-chevron">About Oldspring Trust</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Feature */}
      <section id="campaign-feature--default" className="campaign-feature" aria-labelledby="campaign-feature--default__title">
        <div className="campaign-feature__inner l-contain">
          <div className="campaign-feature__image">
            <figure>
              <span>
                <img src="/templates/bank-pro/homepage-images/feature.jpg" alt="300 Cash Back Checking Bonus" />
              </span>
            </figure>
          </div>
          <div className="campaign-feature__meta-wrap">
            <div className="campaign-feature__meta">
              <h2 id="campaign-feature--default__title" className="campaign-feature__meta-title">Get €300* With a Checking Account Built for You</h2>
              <p className="campaign-feature__meta-text">For a limited time, get a €300 when you open any new checking account! <sup>*</sup>Select "Learn More" to see important offer details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="related-content" aria-labelledby="related-content-list__title">
        <h2 id="related-content-list__title" className="related-content__title">Start Building Your Financial Strength</h2>
        <div className="related-content__items l-contain">
          <div className="related-content__item">
            <div className="related-content__item-meta">
              <h3 className="related-content__item-title">
                <Link href="/tax-checklist-5-things-to-remember">Tax Checklist: 5 Things to Remember</Link>
              </h3>
              <Link href="#" className="related-content__item-label">Starting Out</Link>
              <div className="related-content__item-excerpt">
                Tax season is quickly approaching—do you know what you need to claim, and what forms you need to submit? This tax checklist makes filing simple.
              </div>
            </div>
            <div className="related-content__item-image">
              <img src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/unsplash.jpg" alt="Tax Checklist" />
            </div>
          </div>
          <div className="related-content__item">
            <div className="related-content__item-meta">
              <h3 className="related-content__item-title">
                <Link href="/simple-ways-to-manage-a-checking-account">How to Manage Your Checking</Link>
              </h3>
              <Link href="#" className="related-content__item-label">Starting Out</Link>
            </div>
            <div className="related-content__item-image">
              <img src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/8554477.jpg" alt="open a checking account online" />
            </div>
          </div>
          <div className="related-content__item">
            <div className="related-content__item-meta">
              <h3 className="related-content__item-title">
                <Link href="/how-to-save-for-summer-vacation">How to Save for Summer Vacation</Link>
              </h3>
              <Link href="#" className="related-content__item-label">Starting Out</Link>
            </div>
            <div className="related-content__item-image">
              <img src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/1116302.jpg" alt="saving for a summer vacation" />
            </div>
          </div>
          <div className="related-content__item">
            <div className="related-content__item-meta">
              <h3 className="related-content__item-title">
                <Link href="/the-impact-of-rising-rates-and-inflation-on-your-business">How Rising Rates and Inflation Impact Businesses</Link>
              </h3>
              <Link href="#" className="related-content__item-label">Running a Business</Link>
            </div>
            <div className="related-content__item-image">
              <img src="/templates/bank-pro/learn-and-plan-images/running-a-business/13418669.jpg" alt="Rising interest rates" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="why-hero" aria-label="Testimonials">
        <h2 className="why-hero__title">Hear From Our Customers</h2>
        <div className="why-hero__carousel">
          <div className="l-contain">
            <div className="quote-slider">
              <div className="quote-slider__slides">
                <div className="quote-slider__slide">
                  <blockquote className="quote">
                    <div className="quote__content">
                      <div className="quote__body">
                        <p>I am impressed with the customer service and speed of payout</p>
                      </div>
                      <span className="quote__author">Ralph Morris</span>
                    </div>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ============================================
# AUTH LAYOUT
# ============================================
cat > src/app/auth/layout.tsx << 'EOF'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
EOF

# ============================================
# LOGIN PAGE
# ============================================
cat > src/app/auth/login/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate login - in real app, this would call an API
    setTimeout(() => {
      if (username === 'demo' && password === 'password') {
        router.push('/dashboard')
      } else {
        setError('Your Username or Password is Invalid')
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <img 
          src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
          alt="Oldspring Trust Bank"
          className="h-16 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Enter your username"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1e3a5f] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2b4c7a] disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-[#1e3a5f] hover:text-[#2b4c7a] font-semibold">
          Sign up
        </Link>
      </p>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs font-medium text-gray-500 mb-2">Demo Credentials:</p>
        <p className="text-xs text-gray-600">Username: demo</p>
        <p className="text-xs text-gray-600">Password: password</p>
      </div>
    </div>
  )
}
EOF

# ============================================
# SIGNUP PAGE
# ============================================
cat > src/app/auth/signup/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate signup
    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <img 
          src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" 
          alt="Oldspring Trust Bank"
          className="h-16 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600">Join Oldspring Trust Bank</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1e3a5f] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2b4c7a] disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#1e3a5f] hover:text-[#2b4c7a] font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  )
}
EOF

# ============================================
# DASHBOARD LAYOUT
# ============================================
cat > src/app/dashboard/layout.tsx << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }
    setUser(userData)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" className="h-8" alt="" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  router.push('/')
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
EOF

# ============================================
# DASHBOARD HOME
# ============================================
cat > src/app/dashboard/page.tsx << 'EOF'
'use client'

import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Welcome to your dashboard. Start managing your finances.</p>
      </div>
    </div>
  )
}
EOF

# ============================================
# ABOUT PAGE
# ============================================
cat > src/app/about/page.tsx << 'EOF'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      {/* Sub Hero */}
      <div className="l-sub-hero">
        <section className="sub-hero hero--image">
          <div className="image-hero">
            <div 
              className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-10"
              style={{ 
                backgroundImage: "url('/templates/bank-pro/why-citadel-images/3217  Why Citadel ContentAboutUsv30.jpg')",
                height: '400px',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </div>
          <div className="sub-hero-content l-contain">
            <div className="sub-hero-content-inner">
              <p className="sub-hero__title mb-1">Who We Are</p>
              <p className="sub-hero__teaser">Hi there. We're Oldspring Trust. We promise to help you live your brightest future by inspiring you with the guidance and tools to build financial strength – today and tomorrow.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Content */}
      <div className="bg-white py-12">
        <div className="l-contain">
          <h1 className="text-3xl font-bold text-[#011f4c] mb-6">About Oldspring Trust</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              CryptoPro Investment Platform is a leading, independent Digital Assets Investment platform that provides bespoke financial solutions that add value to our individual and institutional clients. We are licensed and regulated by the Securities & Exchange Commission (SEC) and Financial Industry Regulatory Authority ( FINRA ) to provide Investment Banking, Asset Management and Securities Trading services to our discerning clientele.
            </p>
            <p className="text-gray-700 mb-4">
              We serve as an asset owner on behalf of Prudential With-Profts policyholders, and our pensions and annuity customers. This means we make decisions about how to allocate money to different asset classes and which asset manager should manage our money.
            </p>
          </div>
        </div>
      </div>

      {/* Tiles */}
      <div className="padding-content bg-gray-50 py-12">
        <div className="tiles l-contain">
          <div className="tiles__inner">
            <Link href="#" className="tile">
              <h3 className="tile__heading">Why Choose Oldspring Trust?</h3>
              <p className="tile__body">We provide our credit union members with all things banking, plus the educational resources and guidance to build and maintain financial security.</p>
            </Link>
            <Link href="#" className="tile">
              <h3 className="tile__heading">Annual Reports</h3>
              <p className="tile__body">Read through Oldspring Trust's annual reports, which summarize the company's successes, growth, and corporate milestones each year.</p>
            </Link>
            <Link href="/customer-support" className="tile">
              <h3 className="tile__heading">Contact Us</h3>
              <p className="tile__body">We're here to help! Search our frequently asked questions to get the answers you need right at your fingertips.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Join CTA */}
      <div className="l-join-cta">
        <section className="join-cta join-cta--primary">
          <div className="join-cta-content l-contain text-center">
            <h2 className="join-cta__title">What makes us different?</h2>
            <p className="text-white text-lg">We've built a different kind of high street bank. A bank with stores that are open when it suits you, where you can walk in without an appointment and leave with a working account, debit card and all.</p>
          </div>
        </section>
      </div>

      {/* Quick Bar */}
      <div id="getstarted" className="py-12">
        <div className="quick-bar__wrap l-contain">
          <h2 className="text-center text-2xl font-bold text-[#011f4c] mb-8">Get Started</h2>
          <div className="quick-bar">
            <Link href="#" className="quick-bar__item">
              <img src="/templates/bank-pro/images/assets/get-started-chat.svg" alt="" />
              <div className="quick-bar__text">
                <h3 className="quick-bar__item-header">Live Support</h3>
              </div>
            </Link>
            <Link href="mailto:support@oldspringtrust.com" className="quick-bar__item">
              <img src="/templates/bank-pro/images/assets/get-started-visit-us.svg" alt="" />
              <div className="quick-bar__text">
                <h3 className="quick-bar__item-header">Schedule Appointment</h3>
              </div>
            </Link>
            <Link href="tel:+447451272406" className="quick-bar__item">
              <img src="/templates/bank-pro/images/assets/get-started-call-us.svg" alt="" />
              <div className="quick-bar__text">
                <h3 className="quick-bar__item-header quick-bar__item-header--phone">Call Us</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Join CTA Secondary */}
      <div className="l-join-cta">
        <section className="join-cta join-cta--secondary">
          <div className="join-cta-content l-contain text-center">
            <h2 className="join-cta__title text-[#1e3a5f]">Find a Oldspring Trust location near you.</h2>
            <Link href="#" className="join-cta__link" onClick={() => alert('Unable to determine your location. Please contact support')}>
              Find a Branch
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
EOF

echo ""
echo "✅ Complete Banking Platform Created!"
echo "====================================="
echo ""
echo "📁 Pages Created:"
echo "   • Homepage (matching index.php)"
echo "   • About Us"
echo "   • Login & Signup"
echo "   • Dashboard"
echo ""
echo "🎨 Styles match your model pages exactly"
echo "🖼️  All images point to /public/templates/bank-pro/"
echo ""
echo "🚀 Run: npm run dev"
echo "   Visit: http://localhost:3000"
echo ""
echo "✅ Your banking platform is ready!"
EOF

chmod +x scripts/final_complete_project.sh

echo "Run: ./scripts/final_complete_project.sh"
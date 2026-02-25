#!/bin/bash

# Complete Page Generation Script for Oldspring Trust Bank
# This script creates all pages with proper image paths from templates/bank-pro/

set -e

echo "🏦 Generating Complete Oldspring Trust Bank Pages"
echo "=================================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️ $1${NC}"; }
print_header() { echo -e "${BLUE}📁 $1${NC}"; }

# Create necessary directories
print_header "Creating directory structure..."

mkdir -p src/app
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
mkdir -p src/app/auth/login
mkdir -p src/app/auth/signup
mkdir -p src/app/dashboard

print_success "Directory structure created"

# ============================================
# HOMEPAGE
# ============================================
print_header "Creating Homepage..."

cat > src/app/page.tsx << 'EOF'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header id="header" className="l-header">
        <div className="l-header__bottom">
          <div id="header-inner" className="l-header__bottom-inner l-contain u-cf">
            <a href="/" className="l-header__logo">
              <img src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" width="200" alt="Oldspring Trust Bank" />
              <span className="u-visuallyhidden">Oldspring Trust Bank</span>
            </a>

            <div className="l-header__action">
              <ul className="l-header__action__l1 l-header__action__desktop">
                <li className="is-active">
                  <Link href="/auth/login" data-open="header-login">LOGIN</Link>
                </li>
                <li className="">
                  <Link href="/auth/signup" className="js-header-login-toggle" data-open="header-register">OPEN ACCOUNT</Link>
                </li>
              </ul>
            </div>

            <div className="l-header__nav" style={{display: 'block'}}>
              <span className="header__routing">Routing # 655205039</span>

              <nav id="nav-personal" className="nav-primary js-nav-primary js-nav-personal is-active" aria-label="Personal Banking Navigation">
                <ul className="nav-primary__l1 l-contain">
                  <li className="nav-primary__l1-item">
                    <Link href="/" className="nav-primary__l1-item-link nav-primary__l1-item-link--bank">
                      <span className="nav-primary__l1-item-link-text">Home</span>
                    </Link>
                  </li>
                  <li className="nav-primary__l1-item">
                    <Link href="/" className="nav-primary__l1-item-link nav-primary__l1-item-link--bank">
                      <span className="nav-primary__l1-item-link-text">Bank</span>
                    </Link>
                  </li>
                  <li className="nav-primary__l1-item">
                    <Link href="/save" className="nav-primary__l1-item-link nav-primary__l1-item-link--bank">
                      <span className="nav-primary__l1-item-link-text">Save</span>
                    </Link>
                  </li>
                  <li className="nav-primary__l1-item">
                    <Link href="/borrow" className="nav-primary__l1-item-link nav-primary__l1-item-link--bank">
                      <span className="nav-primary__l1-item-link-text">Borrow</span>
                    </Link>
                  </li>
                  <li className="nav-primary__l1-item">
                    <Link href="/invest" className="nav-primary__l1-item-link nav-primary__l1-item-link--bank">
                      <span className="nav-primary__l1-item-link-text">Wealth & Retire</span>
                    </Link>
                  </li>
                  <li className="nav-primary__l1-item">
                    <Link href="/insure" className="nav-primary__l1-item-link nav-primary__l1-item-link--bank">
                      <span className="nav-primary__l1-item-link-text">Insure</span>
                    </Link>
                  </li>
                  <li className="nav-primary__l1-item">
                    <Link href="/learn-and-plan" className="nav-primary__l1-item-link nav-primary__l1-item-link--bank">
                      <span className="nav-primary__l1-item-link-text">Learn & Plan</span>
                    </Link>
                  </li>
                  <li className="nav-primary__l1-item">
                    <Link href="/payments" className="nav-primary__l1-item-link nav-primary__l1-item-link--bank">
                      <span className="nav-primary__l1-item-link-text">Payments</span>
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="l-header__nav-contacts">
                <div className="l-header__nav-contacts__item">
                  <p className="l-header__nav-contacts__item-title">
                    <span className="icon">
                      <img src="/templates/bank-pro/images/assets/ico-clock.svg" width="30" height="30" alt="" />
                    </span>
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
                    <span className="icon">
                      <img src="/templates/bank-pro/prefooter-icons/ico-star-circle.svg" width="30" height="30" alt="" />
                    </span>
                    Customer Service
                  </p>
                  <p className="l-header__nav-contacts__item-cta">
                    <a href="mailto:support@oldspringtrust.com">
                      <span className="icon">
                        <img src="/templates/bank-pro/icons/footer-icons/call-citadel-credit-union.svg" width="15" height="15" alt="" />
                      </span>
                      support@oldspringtrust.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content">

              {/* Hero Section */}
              <section className="main-hero main-hero--home js-main-hero main-hero--no-helper hero--image js-hero--image" aria-label="Hero Area">
                <div className="main-hero__image">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-6"
                      style={{backgroundImage: "url('/templates/bank-pro/homepage-images/metro.jpg')"}}>
                    </div>
                    <div className="hero-image-bg--mobile main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-6"
                      style={{backgroundImage: "url('/templates/bank-pro/homepage-images/metro.jpg')"}}>
                    </div>
                  </div>
                </div>

                <div className="main-hero__container">
                  <div className="main-hero__content l-contain">
                    <div className="main-hero__header">
                      <p className="main-hero__title" id="main-hero-title">Oldspring Trust Bank</p>
                      <p className="main-hero__subtitle">We do banking differently. We believe that people come first, and that everyone deserves a great experience every step of the way – whether it’s face to face, over the phone, online or on our app.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Static Strip */}
              <section className="static-strip" aria-label="Branch Information">
                <div className="static-strip__inner">
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
                      <div id="branch-hours__dropup" className="static-strip__dropup" data-toggler=".is-active">
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
              <section id="tabbed-feature" className="tabbed-feature js-tabbed-feature" aria-label="Find Your Branch">
                <div className="l-contain">
                  <div className="tabbed-feature__inner">
                    <ul id="tabbed-feature-nav" className="tabbed-feature__tabs tabs">
                      <li className="tabs-title">
                        <a href="#">Oldspring Trust Rates</a>
                      </li>
                      <li className="tabs-title">
                        <a href="#">Oldspring Trust Member Care</a>
                      </li>
                    </ul>
                    <div className="tabbed-feature__content tabs-content">
                      <div className="tabbed-feature__content-item">
                        <a className="tabbed-feature__content-item-title" href="#">
                          <span className="accordion-title-inner">
                            <span className="accordion-title__text">Rates</span>
                          </span>
                          <span className="icon icon--accordion rotate-180">
                            <span className="icon__bg"></span>
                          </span>
                        </a>
                        <div className="tabs-panel-inner">
                          <div className="tabs-panel-inner-wrap">
                            <section className="rates-hero js-rates-hero" data-initial-tab-index="0" aria-label="Oldspring Trust Rates">
                              <div className="l-contain rates-hero__content">
                                <div className="rates-hero__content-item js-rates-hero-content-item">
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
                            </section>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section Links */}
              <section className="section-links" aria-labelledby="section-links--default__title">
                <div className="l-contain">
                  <h2 id="section-links--default__title" className="section-links__title">How Can We Help You Today?</h2>
                  <div className="grid-x grid-padding-x grid-padding-y">
                    <div className="cell small-6 large-4">
                      <div className="section-links__item">
                        <a className="gtm__section-links" href="/">
                          <span className="icon icon--solid">
                            <img src="/templates/bank-pro/section-links/ico-check-account.svg" width="85" height="85" alt="open an account" />
                          </span>
                          <span className="link-chevron">Instant Accounts</span>
                        </a>
                      </div>
                    </div>
                    <div className="cell small-6 large-4">
                      <div className="section-links__item">
                        <a className="gtm__section-links" href="/credit-cards">
                          <span className="icon icon--solid">
                            <img src="/templates/bank-pro/section-links/ico-credit-cards.svg" width="85" height="85" alt="Credit Cards" />
                          </span>
                          <span className="link-chevron">Credit Cards</span>
                        </a>
                      </div>
                    </div>
                    <div className="cell small-6 large-4">
                      <div className="section-links__item">
                        <a className="gtm__section-links" href="/borrow">
                          <span className="icon icon--solid">
                            <img src="/templates/bank-pro/section-links/ico-loans.svg" width="85" height="85" alt="Loans" />
                          </span>
                          <span className="link-chevron">Loans</span>
                        </a>
                      </div>
                    </div>
                    <div className="cell small-6 large-4">
                      <div className="section-links__item">
                        <a className="gtm__section-links" href="/business-banking">
                          <span className="icon icon--solid">
                            <img src="/templates/bank-pro/section-links/ico-businessbanking.svg" width="85" height="85" alt="business banking" />
                          </span>
                          <span className="link-chevron">Business Banking</span>
                        </a>
                      </div>
                    </div>
                    <div className="cell small-6 large-4">
                      <div className="section-links__item">
                        <a className="gtm__section-links" href="/invest">
                          <span className="icon icon--solid">
                            <img src="/templates/bank-pro/section-links/ico-invest.svg" width="85" height="85" alt="Invest" />
                          </span>
                          <span className="link-chevron">Wealth & Retire</span>
                        </a>
                      </div>
                    </div>
                    <div className="cell small-6 large-4">
                      <div className="section-links__item">
                        <a className="gtm__section-links" href="/about">
                          <span className="icon icon--solid">
                            <img src="/templates/bank-pro/section-links/ico-about.svg" width="85" height="85" alt="About Oldspring Trust" />
                          </span>
                          <span className="link-chevron">About Oldspring Trust</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Campaign Feature */}
              <section id="campaign-feature--default" className="campaign-feature" aria-labelledby="campaign-feature--default__title">
                <div className="campaign-feature__inner">
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
                      <p className="campaign-feature__meta-text">For a limited time, get a €300 when you open any new checking account! Select "Learn More" to see important offer details.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Related Content */}
              <section className="related-content" aria-labelledby="related-content-list__title">
                <h2 id="related-content-list__title" className="related-content__title">Start Building Your Financial Strength</h2>
                <div className="related-content__items">
                  <div className="related-content__item">
                    <div className="related-content__item-meta">
                      <h3 className="related-content__item-title">
                        <a className="link-chevron" href="/tax-checklist-5-things-to-remember">
                          <span>Tax Checklist: 5 Things to Remember</span>
                        </a>
                      </h3>
                      <a className="related-content__item-label" href="#">Starting Out</a>
                      <div className="related-content__item-excerpt">Tax season is quickly approaching&mdash;do you know what you need to claim, and what forms you need to submit? This tax checklist makes filing simple. Learn more today!</div>
                    </div>
                    <div className="related-content__item-image">
                      <div className="related-content__item-image-wrap">
                        <img src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/unsplash.jpg" alt="Img" />
                      </div>
                    </div>
                  </div>
                  <div className="related-content__item">
                    <div className="related-content__item-meta">
                      <h3 className="related-content__item-title">
                        <a className="link-chevron" href="/simple-ways-to-manage-a-checking-account">
                          <span>How to Manage Your Checking</span>
                        </a>
                      </h3>
                      <a className="related-content__item-label" href="#">Starting Out</a>
                    </div>
                    <div className="related-content__item-image">
                      <div className="related-content__item-image-wrap">
                        <img src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/8554477.jpg" alt="open a checking account online" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Testimonials */}
              <section className="why-hero" aria-label="Testimonials">
                <h2 className="why-hero__title">Hear From Our Customers</h2>
                <div className="why-hero__carousel">
                  <div className="l-contain">
                    <div className="quote-slider js-quote-slider">
                      <div className="quote-slider__slides">
                        <div className="quote-slider__slide js-quote-slider-slide">
                          <blockquote className="quote u-cf">
                            <div className="quote__content">
                              <div className="quote__body">
                                <div className="rtf">
                                  <p>I am impressed with the customer service and speed of payout<br /></p>
                                </div>
                              </div>
                              <span className="quote__author u-block l-mb-1">Ralph Morris</span>
                            </div>
                          </blockquote>
                        </div>
                        <div className="quote-slider__slide js-quote-slider-slide">
                          <blockquote className="quote u-cf">
                            <div className="quote__content">
                              <div className="quote__body">
                                <div className="rtf">
                                  <p>All one has to do is to look at your investment to see how well it is being looked after.</p>
                                </div>
                              </div>
                              <span className="quote__author u-block l-mb-1">Ted Moralee</span>
                            </div>
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Footer Top */}
      <div className="l-footer__top">
        <div className="footer-quick-bar l-contain">
          <div className="footer-quick-bar__item footer-quick-bar__item--routing">
            <img src="/templates/bank-pro/icons/footer-icons/citadel-credit-union-routing-number.svg" alt="" />
            <div className="footer-quick-bar__text">
              <h2 className="footer-quick-bar__item-header">Routing #</h2>
              <h3 className="footer-quick-bar__item-subtitle">655205039</h3>
            </div>
          </div>
          <div className="footer-quick-bar__item footer-quick-bar__item--clock">
            <img src="/templates/bank-pro/icons/prefooter-icons/icoclock.png" alt="" />
            <div className="footer-quick-bar__text">
              <h2 className="footer-quick-bar__item-header">Branch Hours: <span className="weight-reg">Mon - Thurs: 8:30 a.m.-5:00 p.m.</span></h2>
              <h2 className="footer-quick-bar__item-header">Friday: <span className="weight-reg">8:30 a.m.-6:00 p.m.</span></h2>
              <h2 className="footer-quick-bar__item-header">Saturday: <span className="weight-reg">9:00 a.m.-1:00 p.m.</span></h2>
            </div>
          </div>
          <div className="footer-quick-bar__item footer-quick-bar__item--phone">
            <img src="/templates/bank-pro/icons/footer-icons/call-citadel-credit-union.svg" alt="" />
            <div className="footer-quick-bar__text">
              <h2 className="footer-quick-bar__item-header">
                <a className="footer-quick-bar__item-header footer-quick-bar__item-header--phone" href="mailto:support@oldspringtrust.com">support@oldspringtrust.com</a>
              </h2>
              <h3 className="footer-quick-bar__item-subtitle">Customer Service</h3>
            </div>
          </div>
          <div className="footer-quick-bar__item footer-quick-bar__item--video">
            <img src="/templates/bank-pro/footer-images/live-video-call.png" alt="" />
            <div className="footer-quick-bar__text">
              <h2 className="footer-quick-bar__item-header">
                <a className="footer-quick-bar__item-header footer-quick-bar__item-header--video" href="#" onClick={() => alert('Temporarily unavailable, please contact us via Email')}>
                  Video Connect
                </a>
              </h2>
              <h3 className="footer-quick-bar__item-subtitle">Chat Virtually</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="l-footer">
        <div className="l-footer-main">
          <div className="l-footer-inner l-contain">
            <div className="l-footer-inner--left">
              <div className="l-footer__about">
                <div className="footer-about">
                  <h2 className="footer-about__header">Building Strength Together</h2>
                  <p className="footer-about__info">
                    <span>Oldspring Trust is a not-for-profit credit union bank built on the unshakeable promise to serve those who work every day to build a better future for us all. For over 80 years, we've delivered a breadth of financial services, expert guidance, and innovative tools to help strengthen and grow businesses, families, and our local communities. We are your Oldspring Trust, and we are Building Strength Together.</span>
                  </p>
                </div>
              </div>

              <div className="l-footer__nav">
                <div className="footer-nav u-cf">
                  <div className="footer-nav__col1">
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><a href="/about" className="footer-nav__link">About Oldspring Trust</a></li>
                      <li className="footer-nav__item"><a href="/about" className="footer-nav__link">Who we are</a></li>
                      <li className="footer-nav__item"><a href="/customer-support" className="footer-nav__link">Contact Us</a></li>
                    </ul>
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><a href="/news" className="footer-nav__link">News & Events</a></li>
                      <li className="footer-nav__item"><a href="/news" className="footer-nav__link">Latest News</a></li>
                    </ul>
                  </div>

                  <div className="footer-nav__col2">
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><a href="/careers" className="footer-nav__link">Careers</a></li>
                      <li className="footer-nav__item"><a href="/careers" className="footer-nav__link">Get Started</a></li>
                    </ul>
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><a href="/giving-back" className="footer-nav__link">Giving Back</a></li>
                      <li className="footer-nav__item"><a href="/giving-back" className="footer-nav__link">Oldspring Trust Charity</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="l-footer-inner--right">
              <div className="l-footer__services">
                <div className="footer-services">
                  <h2 className="footer-services__header"><a href="#">Member Services</a></h2>
                  <ul className="footer-services__nav">
                    <li className="footer-services__nav-item"><a href="/payments" className="footer-services__nav-link">Loan Payments</a></li>
                    <li className="footer-services__nav-item"><a href="#" className="footer-services__nav-link">Referral Service</a></li>
                    <li className="footer-services__nav-item"><a href="#" className="footer-services__nav-link">Oldspring Trust Security<sup>™</sup></a></li>
                    <li className="footer-services__nav-item"><a href="mailto:support@oldspringtrust.com" className="footer-services__nav-link">Email Us</a></li>
                  </ul>
                  <img src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" width="255" alt="Oldspring Trust New Logo" />
                  <hr />
                  <div className="footer-nav__col1">
                    <ul className="footer-nav__links">
                      <li className="footer-nav__item"><a href="#" className="footer-nav__link">Location</a></li>
                      <li className="footer-nav__item"><a href="#" className="footer-nav__link">100 Bishopsgate, London EC2N 4AG, italfie,United Kingdom</a></li>
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
                <a href="/privacy-policy" className="footer-site-links__link" target="_self">Privacy Policy</a>
                <a href="/faqs" className="footer-site-links__link" target="_self">FAQs</a>
                <a href="#" className="footer-site-links__link">Sitemap</a>
              </div>

              <div className="footer-site-links__right">
                <a href="#" target="_blank">
                  <img src="/templates/bank-pro/blue-seal-200-42-bbb-80015515.png" style={{border: 0}} alt="Oldspring Trust Bank BBB Business Review" />
                </a>
                <a href="#" className="footer-site-links__ncua-link footer-site-links__ncua-link--lender">
                  <img src="/templates/bank-pro/images/assets/ncua-lender.png" alt="Lender" />
                </a>
                <a href="#" className="footer-site-links__ncua-link footer-site-links__ncua-link--lender">
                  <img src="/templates/bank-pro/images/assets/ncua-cert.png" alt="Lender" />
                </a>
                <span className="footer-site-links__ncua-link footer-site-links__ncua-link--certificate">Federally Insured by NCUA</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
EOF
print_success "Homepage created with proper image paths"

# ============================================
# ABOUT PAGE
# ============================================
print_header "Creating About page..."

cat > src/app/about/page.tsx << 'EOF'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - same as homepage but we'll reuse */}
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-10"
                      style={{backgroundImage: "url('/templates/bank-pro/why-citadel-images/3217  Why Citadel ContentAboutUsv30.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Who We Are</p>
                      <p className="sub-hero__teaser p">Hi there. We're Oldspring Trust. We promise to help you live your brightest future by inspiring you with the guidance and tools to build financial strength – today and tomorrow.</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="About Us">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p style={{marginBottom: '0px', lineHeight: '1.7', padding: '10px 5px', color: '#011f4c'}}>
                      CryptoPro Investment Platform is a leading, independent Digital Assets Investment platform that provides bespoke financial solutions that add value to our individual and institutional clients. We are licensed and regulated by the Securities & Exchange Commission (SEC) and Financial Industry Regulatory Authority ( FINRA ) to provide Investment Banking, Asset Management and Securities Trading services to our discerning clientele.
                    </p>
                    <p style={{marginBottom: '0px', lineHeight: '1.7', padding: '10px 5px', color: '#011f4c'}}>
                      We serve as an asset owner on behalf of Prudential With-Profts policyholders, and our pensions and annuity customers. This means we make decisions about how to allocate money to different asset classes and which asset manager should manage our money.
                    </p>
                    <p style={{marginBottom: '0px', lineHeight: '1.7', padding: '10px 5px', color: '#011f4c'}}>
                      We approach sustainability from three perspectives: an asset owner, an asset manager, and as a company in our own right, While our responsibilities and obligations in each of these three roles may differ, as we discuss below, our approach in all three is united by a common set of principles and ambitions.
                    </p>
                  </div>
                </div>

                <div className="padding-content">
                  <div className="tiles tiles--arrows l-contain mt-3 js-tiles">
                    <div className="js-tiles-container">
                      <div className="tiles__inner js-tile-group">
                        <a className="tile js-tile tile--link" href="#">
                          <h3 className="tile__heading">Why Choose Oldspring Trust?</h3>
                          <p className="tile__body">We provide our credit union members with all things banking, plus the educational resources and guidance to build and maintain financial security. Here's why you should join us.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#">
                          <h3 className="tile__heading">Annual Reports</h3>
                          <p className="tile__body">Read through Oldspring Trust's annual reports, which summarize the company's successes, growth, and corporate milestones each year.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="/customer-support">
                          <h3 className="tile__heading">Contact Us</h3>
                          <p className="tile__body">We're here to help! Search our frequently asked questions to get the answers you need right at your fingertips. Get quick access to all our contact information.</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="l-join-cta content-nav-section" data-short-name="CTA">
                  <section className="join-cta join-cta--primary" aria-label="Join Oldspring Trust">
                    <div className="join-cta-content l-contain u-align-center">
                      <h2 className="join-cta__title">What makes us different?</h2>
                      <p style={{color: '#fff'}}>We've built a different kind of high street bank. A bank with stores that are open when it suits you, where you can walk in without an appointment and leave with a working account, debit card and all. A bank that tells you exactly what you're getting, in language that actually makes sense. A bank that puts you first.</p>
                    </div>
                  </section>
                </div>

                <div id="getstarted">
                  <div className="quick-bar__wrap l-contain">
                    <h2 className="u-align-center h2">Get Started</h2>
                    <div className="quick-bar">
                      <a href="#" className="quick-bar__item" rel="noopener noreferrer" target="_blank">
                        <img src="/templates/bank-pro/images/assets/get-started-chat.svg" alt="" />
                        <div className="quick-bar__text mt-2">
                          <h3 className="quick-bar__item-header">Live Support</h3>
                        </div>
                      </a>
                      <a className="quick-bar__item" href="mailto:support@oldspringtrust.com">
                        <img src="/templates/bank-pro/images/assets/get-started-visit-us.svg" alt="" />
                        <div className="quick-bar__text mt-2">
                          <h3 className="quick-bar__item-header">Schedule Appointment</h3>
                        </div>
                      </a>
                      <a className="quick-bar__item" href="tel:+447451272406">
                        <img src="/templates/bank-pro/images/assets/get-started-call-us.svg" alt="" />
                        <div className="quick-bar__text mt-2">
                          <h3 className="quick-bar__item-header quick-bar__item-header--phone">Call Us</h3>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "About page created"

# ============================================
# BORROW PAGE
# ============================================
print_header "Creating Borrow page..."

cat > src/app/borrow/page.tsx << 'EOF'
import Link from 'next/link'

export default function BorrowPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-7"
                      style={{backgroundImage: "url('/templates/bank-pro/borrow-images/Citadel_AlkemyX_00034_borrow_kat_1600x650.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Loans & Lines of Credit</p>
                      <p className="sub-hero__teaser p">Oldspring Trust's range of lending products makes it easy to access the money you need, when you need it.</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Borrow">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <a name="learnmore"></a>
                    <p>Enjoy low rates on all our loan products. Business or personal, one-time or ongoing&mdash; Oldspring Trust is here to support all your financing needs. Whether looking for the best auto loan rates, low interest personal loans or our current mortgage interest rates, we're here to help!</p>
                  </div>
                </div>

                <div className="padding-content">
                  <div className="tiles tiles--arrows l-contain mt-3 js-tiles">
                    <div className="js-tiles-container">
                      <div className="tiles__inner js-tile-group">
                        <a className="tile js-tile tile--link" href="#" id="creditcard">
                          <h3 className="tile__heading">Oldspring Trust Credit Cards</h3>
                          <p className="tile__body">Compare the features of Oldspring Trust's credit cards to find the one that offers you the convenience, rewards, and low rates that meet your everyday needs. Learn More.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="mortgage">
                          <h3 className="tile__heading">Get a Oldspring Trust Mortgage or Home Equity Loan</h3>
                          <p className="tile__body">Whether you're buying or refinancing or looking to take advantage of the equity in your home, Oldspring Trust is here to help. Visit Oldspring Trust's Home Loan Center today!</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="personal">
                          <h3 className="tile__heading">Personal Loans</h3>
                          <p className="tile__body">Finding the money you need is simple with Oldspring Trust's personal borrowing options. Choose from a personal loan or a line of credit. Compare the features to see which is right for you.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="auto">
                          <h3 className="tile__heading">Auto Loans From Oldspring Trust</h3>
                          <p className="tile__body">Oldspring Trust offers some of the lowest rates on car loans in the area. View our car loan and refinance rates, estimate your payment with our calculator, and get pre-approved.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="refinance">
                          <h3 className="tile__heading">Auto Refinance</h3>
                          <p className="tile__body">Looking to refinance your auto loan? Oldspring Trust offers some of the most competitive rates in the area. Use our auto refinance calculator below to understand your new monthly payment.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="student">
                          <h3 className="tile__heading">Student Loans From Oldspring Trust</h3>
                          <p className="tile__body">Oldspring Trust has partnered with Sallie Mae to offer the Smart Option Student Loan® and the Parent Loan for families to finance higher education expenses not covered by scholarships and federal loans.</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Borrow page created"

# ============================================
# SAVE PAGE
# ============================================
print_header "Creating Save page..."

cat > src/app/save/page.tsx << 'EOF'
import Link from 'next/link'

export default function SavePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient"
                      style={{backgroundImage: "url('/templates/bank-pro/save-images/Citadel_AlkemyX_06578_save_family_1600x650.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">The Smart Place to Save</p>
                      <p className="sub-hero__teaser p">Oldspring Trust Bank is a highly ranked global financial institution</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Save">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p>Whether you are saving toward short- or long- term goals, or creating a retirement nest egg, we can help you find the savings plan that works best for you. Enjoy competitive savings account rates on products for the entire family.</p>
                    <p>At Oldspring Trust, we have an array of products to meet your savings goals &mdash; from <a href="#">High Yield Savings accounts</a> to <a href="#">Kids Savings Accounts</a> and <a href="#">Holiday Club</a>, <a href="#">Money Market Savings Accounts</a> and more!</p>
                    <p><a href="#">Open a Savings Account</a> online with Oldspring Trust today! Not sure sure which account is right for you? <a rel="noopener noreferrer" href="#">Schedule an appointment</a> to speak with a representative today.</p>
                  </div>
                </div>

                <div className="padding-content">
                  <div className="rtf mt-2 mb-4 l-contain" id="HighYieldSavings">
                    <h3 className="tile__heading">High Yield Savings Account</h3>
                    <p className="tile__body">If a savings account with continuous high returns and flexible access to your money makes sense for you, learn more about our High Yield Savings Account today!<br /></p>
                  </div>

                  <div className="rtf mt-2 mb-4 l-contain" id="StarSavings">
                    <h3 className="tile__heading">Star Savings</h3>
                    <p className="tile__body">The Oldspring Trust Savings account makes it easy to save for your short- or long-term goals. Open an account today, and enjoy better rates, online and mobile banking, and much more.</p>
                  </div>

                  <div className="rtf mt-2 mb-4 l-contain" id="Certificates">
                    <h3 className="tile__heading">Certificates</h3>
                    <p className="tile__body">Oldspring Trust Certificates &ndash; commonly referred to as CDs or certificates of deposit by other financial institutions &ndash; offer high rates and flexible terms. Lock in a great rate today!</p>
                  </div>

                  <div className="rtf mt-2 mb-4 l-contain" id="HolidayClub">
                    <h3 className="tile__heading">Holiday Club & Auxiliary Savings</h3>
                    <p className="tile__body">Our Holiday Club Savings account lets you put money aside and grow with no minimum balance. Each year, the funds are transferred to your Oldspring Trust Savings account for the holidays. Learn more.</p>
                  </div>

                  <div className="rtf mt-2 mb-4 l-contain" id="MoneyMarket">
                    <h3 className="tile__heading">Money Market Account</h3>
                    <p className="tile__body">Oldspring Trust's Money Market account has consistently higher rates that increase as your balance grows. Open an account and start saving more today.</p>
                  </div>
                </div>

                <div className="l-join-cta content-nav-section" data-short-name="CTA">
                  <section className="join-cta join-cta--primary" aria-label="Join Oldspring Trust">
                    <div className="join-cta-content l-contain u-align-center">
                      <h2 className="join-cta__title">Ready to speak with a representative about a Oldspring Trust savings account?</h2>
                      <a href="mailto:support@oldspringtrust.com" className="join-cta__link" rel="noopener noreferrer" target="_blank">Schedule Appointment</a>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Save page created"

# ============================================
# INVEST PAGE
# ============================================
print_header "Creating Invest page..."

cat > src/app/invest/page.tsx << 'EOF'
import Link from 'next/link'

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient"
                      style={{backgroundImage: "url('/templates/bank-pro/invest-images/Citadel_AlkemyX_00405_weatlh_kate_1600x650.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Helping You Invest in Your Future</p>
                      <p className="sub-hero__teaser p">Whether you're starting to save or ready to retire, we have investment solutions to help meet your needs.</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Wealth & Retire">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p>From building college savings and growing your retirement during working years to retirement planning and asset management&mdash;our <a href="#">CFS Financial Advisors</a> offer personalized financial services and investment advice to help you prepare for every stage of life. Whether you're interested in rolling over an IRA, estate planning or simply how to manage money - our investment advisors are here to help.</p>
                    <p>Being a Oldspring Trust customer, you'll have access to your very own personal finance advisor to help guide you through process of financial budgeting, retirement savings and more. <a href="#">Contact an investment advisor</a> today to schedule a complimentary consultation.</p>
                    <p>Manage your portfolio, check quotes, make trades, and more online. Take full control of your future and manage your investments anywhere, at any time with Oldspring Trust's convenient <a href="#">online investing and brokerage tools</a>.</p>
                  </div>
                </div>

                <div className="padding-content">
                  <div className="tiles tiles--arrows l-contain mt-3 js-tiles">
                    <div className="js-tiles-container">
                      <div className="tiles__inner js-tile-group">
                        <a className="tile js-tile tile--link" href="#" id="investmentTeam">
                          <h3 className="tile__heading">Our Investment Team</h3>
                          <p className="tile__body">Schedule a complimentary consultation with a CFS advisor at Oldspring Trust to help you manage your assets, create your retirement plan, and guide you toward your financial goals.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="retirement">
                          <h3 className="tile__heading">Retirement Planning</h3>
                          <p className="tile__body">The experienced CFS* investment advisors at Oldspring Trust can help you plan for your future with investment strategies and retirement income planning customized for your needs.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="financial">
                          <h3 className="tile__heading">Financial Planning</h3>
                          <p className="tile__body">CFS Financial Advisors at Oldspring Trust offer professional analysis, sound financial guidance, and personalized, professional planning services to help you meet your short- and long-term financial goals.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="estate">
                          <h3 className="tile__heading">Estate Planning & Wealth Transfer</h3>
                          <p className="tile__body">We'll help plan your estate allocation and work to ensure a smooth transition when a loved one passes away. We assist in transferring wealth to beneficiaries through tax-efficient strategies.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="ira">
                          <h3 className="tile__heading">IRA Rollover Assistance</h3>
                          <p className="tile__body">Together we'll navigate how to best initiate your rollover, if appropriate, and help reduce tax liability in the event of severance from employment, termination, or retirement after years of service.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="online">
                          <h3 className="tile__heading">Online Investing & Brokerage</h3>
                          <p className="tile__body">Smart tools for smarter investing. Manage your portfolio, check quotes, make trades, and more online. Get started with our suite of tools today.</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Invest page created"

# ============================================
# INSURE PAGE
# ============================================
print_header "Creating Insure page..."

cat > src/app/insure/page.tsx << 'EOF'
import Link from 'next/link'

export default function InsurePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-8"
                      style={{backgroundImage: "url('/templates/bank-pro/invest-images/wealth-management-bucks-county-what-is-estate-planning.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Insurance Services</p>
                      <p className="sub-hero__teaser p">Enjoy lower premiums and priceless peace of mind when you secure your auto, home, and future with Oldspring Trust.</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Insure">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p>As a Oldspring Trust customer, you'll enjoy lower insurance premiums on auto, renters, homeowners, life, and more. With Oldspring Trust's full range of insurance services, you can get the comprehensive coverage you need and feel assured that your family's financial stability is protected no matter what. Our premiums are affordable. Your security is priceless.</p>
                  </div>
                </div>

                <div className="padding-content">
                  <div className="tiles tiles--arrows l-contain mt-3 js-tiles">
                    <div className="js-tiles-container">
                      <div className="tiles__inner js-tile-group">
                        <a className="tile js-tile tile--link" href="#" id="medicare">
                          <h3 className="tile__heading">Medicare Insurance</h3>
                          <p className="tile__body">At Oldspring Trust, we offer consultative services with a certified Medicare Specialist to help you and your family be prepared in retirement.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="auto">
                          <h3 className="tile__heading">Auto Insurance</h3>
                          <p className="tile__body">Take the hassle out of insurance shopping. Oldspring Trust works with Travelers to bring our members quality coverage, special rates, and discounts on premiums. Get a free quote today.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="homeowners">
                          <h3 className="tile__heading">Homeowners and Renters Insurance</h3>
                          <p className="tile__body">Protect your home from damage or loss with homeowners insurance from Oldspring Trust. We will work with you to help you get the coverage you need at a fair price. Get a free quote today.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="life">
                          <h3 className="tile__heading">Life Insurance</h3>
                          <p className="tile__body">Oldspring Trust offers affordable and flexible life insurance, and free guidance with an insurance expert.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="accidental">
                          <h3 className="tile__heading">Accidental Death & Dismemberment (AD&D) Insurance</h3>
                          <p className="tile__body">Your accidental death can leave your family with a significant financial burden. Don't leave them unprepared.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#" id="hospital">
                          <h3 className="tile__heading">Hospital Accident Insurance</h3>
                          <p className="tile__body">Hospital Accident Insurance protects you and your family in the event you are hospitalized due to an accident. Learn more and enroll today.</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="l-join-cta content-nav-section" data-short-name="CTA">
                  <section className="join-cta join-cta--primary" aria-label="Join Oldspring Trust">
                    <div className="join-cta-content l-contain u-align-center">
                      <h2 className="join-cta__title">Oldspring Trust is dedicated to protecting the finances, privacy, and data of our customers.</h2>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Insure page created"

# ============================================
# LEARN AND PLAN PAGE
# ============================================
print_header "Creating Learn and Plan page..."

cat > src/app/learn-and-plan/page.tsx << 'EOF'
import Link from 'next/link'

export default function LearnAndPlanPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">
              <section className="learn-and-plan-hero">
                <div className="learn-and-plan-hero__grid">
                  <div className="grid-item"
                    style={{backgroundImage: "url('/templates/bank-pro/learn-and-plan-images/learn-and-plan-hero/Learn and Plan Page Updates - cafe.jpg')"}}>
                  </div>
                  <div className="grid-item"
                    style={{backgroundImage: "url('/templates/bank-pro/learn-and-plan-images/learn-and-plan-hero/Learn and Plan Page Updates - wedding.jpg')"}}>
                  </div>
                  <div className="grid-item"
                    style={{backgroundImage: "url('/templates/bank-pro/learn-and-plan-images/learn-and-plan-hero/Learn and Plan Page Updates - graduation.jpg')"}}>
                  </div>
                  <div className="grid-item"
                    style={{backgroundImage: "url('/templates/bank-pro/learn-and-plan-images/learn-and-plan-hero/Learn and Plan Page Updateschecking - financials.jpg')"}}>
                  </div>
                  <div className="grid-item grid-item--main"
                    style={{background: "linear-gradient(rgba(0,130,170,0),rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('/templates/bank-pro/learn-and-plan-images/learn-and-plan-hero/Learn and Plan Page Updates - working together.jpg')", backgroundSize: 'cover'}}>
                    <div className="learn-and-plan-hero__content">
                      <div className="content">
                        <h1 className="content__title">Learn More. Make A Plan.</h1>
                        <p className="content__text">It's your money. Discover how to make the most of it.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Learn & Plan">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p>Oldspring Trust not only provides the financial tools and accounts that help you manage your money, but also the educational resources to help you build financial strength. Expand your knowledge, learn new skills, and be able to make more informed decisions about your financial well-being by exploring the articles below.</p>
                  </div>
                </div>

                <div className="padding-content">
                  <div className="tiles tiles--arrows l-contain mt-3 js-tiles">
                    <div className="js-tiles-container">
                      <div className="tiles__inner js-tile-group">
                        <a className="tile js-tile tile--link" href="/tax-checklist-5-things-to-remember">
                          <h3 className="tile__heading">Tax Checklist: 5 Things to Remember</h3>
                          <p className="tile__body">Tax season is quickly approaching&mdash;do you know what you need to claim, and what forms you need to submit? This tax checklist makes filing simple. Learn more today!</p>
                        </a>
                        <a className="tile js-tile tile--link" href="/how-to-save-for-summer-vacation">
                          <h3 className="tile__heading">How to Start Saving for Summer Vacation</h3>
                          <p className="tile__body">Summer is almost here! Learn more about budgeting and saving for your next summer vacation.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="/simple-ways-to-manage-a-checking-account">
                          <h3 className="tile__heading">Simple Ways to Manage a Checking Account</h3>
                          <p className="tile__body">While you might not often find yourself writing out an actual paper check, you still need a checking account. Here's how to manage it.</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Learn and Plan page created"

# ============================================
# PAYMENTS PAGE
# ============================================
print_header "Creating Payments page..."

cat > src/app/payments/page.tsx << 'EOF'
import Link from 'next/link'

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-10"
                      style={{backgroundImage: "url('/templates/bank-pro/borrow-images/Citadel_AlkemyX_00034_borrow_kat_1600x650.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Easy & Secure Loan Payments</p>
                      <p className="sub-hero__teaser p">Thank you for choosing Oldspring Trust Bank as your lending partner. Pay your loan now or set up automatic payments.</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Payments">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p><span>Oldspring Trust offers several convenient options to make payments on auto loans, personal loans, and mortgages. You can also find out if you're eligible to <a href="#">Skip-a-pay</a>!</span></p>

                    <h2><a href="#auto">Automatic Payments</a> | <a href="#external">Pay from Non- Oldspring Trust Account</a> | <a href="#onetime">One-Time Payments</a> | <a href="#mail">By Mail</a> | <a href="#person">In Person</a></h2>

                    <a name="auto"></a>
                    <h2>Set Up Automatic Payments</h2>
                    <p><span>Never miss a payment due date when you set up automatic payments. With Online Banking and the Oldspring Trust Mobile, setting up automatic payments is fast, easy, and secure!</span></p>

                    <a name="external"></a>
                    <h2>Pay from Non- Oldspring Trust Account</h2>
                    <p><span>Make a one-time payment or set up recurring payments using your non- Oldspring Trust bank's bill pay feature. Simply follow your bank or credit union's instructions for setting up online payments. You will need Oldspring Trust's routing number: 655205039.</span></p>

                    <a name="onetime" id="one"></a>
                    <h2>One-Time Payments</h2>
                    <p>Need to make a payment quickly? Our Express Pay options are designed to help you make a one-time payment as fast as possible with a debit or eCheck. <strong>Please note: A fee applies to each of these payment methods.</strong></p>

                    <a name="mail" id="two"></a>
                    <h2>Pay by Mail</h2>
                    <p>Mail your payments to:</p>
                    <p style={{marginLeft: '40px'}}>
                      Oldspring Trust Loan Payments<br />
                      100 Bishopsgate, London EC2N 4AG, italfie,United Kingdom
                    </p>

                    <a name="person" id="three"></a>
                    <h2>Pay at a Branch</h2>
                    <p>Make your payment in-person at any of our convenient <a href="#">branch locations</a> using our free, self-serve Oldspring Trust Express Banking. If you need assistance, a member of our team will be happy to help during business hours. <a href="#">Find a branch</a> near you today!</p>
                  </div>
                </div>

                <div className="l-join-cta content-nav-section" data-short-name="CTA">
                  <section className="join-cta join-cta--secondary join-cta--ms" aria-label="Join Oldspring Trust">
                    <div className="join-cta-content l-contain u-align-center">
                      <h2 className="join-cta__title">Need help making a payment?</h2>
                      <a href="/customer-support" className="join-cta__link" title="Make a Payment Quiz">Let Us Know</a>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Payments page created"

# ============================================
# BUSINESS BANKING PAGE
# ============================================
print_header "Creating Business Banking page..."

cat > src/app/business-banking/page.tsx << 'EOF'
import Link from 'next/link'

export default function BusinessBankingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-10"
                      style={{backgroundImage: "url('/templates/bank-pro/business-banking/business-banking-sectionlanding-1600x650_NEW_hero.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Business Banking from Oldspring Trust Bank</p>
                      <p className="sub-hero__teaser p">Our local experts are here to help you customize a premium product package that's tailored to your organization's current needs and scalable for future growth.</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Business Banking">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p>Oldspring Trust offers a full suite of dynamic products and services for businesses in the Greater Philadelphia area that are looking for a better banking experience. Unlike traditional banks, Oldspring Trust's Business Banking is built upon the Credit Union's not-for-profit status, which allows for a unique level of service and commitment to help build financially strong businesses that directly influence and care for our communities, families, and overall local economic health.</p>
                  </div>
                </div>

                <div className="content-nav-section" data-short-name="">
                  <div className="rtf u-cf padding-content l-contain">
                    <figure className="u-float-l u-cf">
                      <p>
                        <img height="386" alt="Oldspring Trust Business Checking Account" width="580" src="/templates/bank-pro/business-banking/in-page-business-checking-580x386.jpg" />
                      </p>
                    </figure>
                    <h3><strong>Business Checking Accounts</strong></h3>
                    <p>Both of Oldspring Trust's business checking accounts have day-to-day expenses covered. Choose from our Essential Business Checking or Elite Business Checking accounts to help your growing business reach the next level.</p>

                    <p style={{clear: 'both'}}>&nbsp;</p>
                    <figure className="u-float-l u-cf">
                      <p>
                        <img height="386" alt="Oldspring Trust Business Savings" width="580" src="/templates/bank-pro/business-banking/in-page-business-savings-580x386.jpg" />
                      </p>
                    </figure>
                    <h3><strong>Business Savings Accounts</strong></h3>
                    <p>Be prepared for unplanned business expenses or save for future endeavors with a variety of savings options, including our Business High Yield Savings Account, Money Market accounts, and Business Certificates.</p>

                    <p style={{clear: 'both'}}>&nbsp;</p>
                    <figure className="u-float-l u-cf">
                      <p>
                        <img height="386" alt="Oldspring Trust Business Loans" width="580" src="/templates/bank-pro/business-banking/in-page-business-loans-580x386.jpg" />
                      </p>
                    </figure>
                    <h3><strong>Business Loans & Credit Cards</strong></h3>
                    <p>We believe that great rates on cost-effective financing empowers business leaders and creators to confidently do what they love while their businesses prosper. Choose from a variety of Vehicle & Equipment Loans, Lines of Credit, Business Real Estate Loans and credit cards to support working capital and manage cash flow obstacles along the way.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Business Banking page created"

# ============================================
# CREDIT CARDS PAGE
# ============================================
print_header "Creating Credit Cards page..."

cat > src/app/credit-cards/page.tsx << 'EOF'
import Link from 'next/link'

export default function CreditCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-7"
                      style={{backgroundImage: "url('/templates/bank-pro/borrow-images/Citadel_AlkemyX_00034_borrow_kat_1600x650.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Credit cards</p>
                      <p className="sub-hero__teaser p">Compare Oldspring Trust's Credit Cards</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative u-cf">
                <div className="content-nav-section" data-short-name="Credit Cards">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p>Compare the features of Oldspring Trust Mastercards to find the one that offers you the convenience, rewards, and low rates that meet your everyday needs. Oldspring Trust offers credit cards with <a href="#">low APR</a>, <a href="#">cash rewards</a>, and <a href="#">rewards for travel </a>and <a href="#"> entertainment</a>. Plus enjoy <a href="#">no balance transfer fees</a>, no matter which credit card you choose.</p>
                    <p>To learn more about Oldspring Trust's low APR credit cards, credit card offers and much more <a href="#">schedule an appointment</a> today!</p>
                  </div>
                </div>

                <div className="l-product-list l-contain">
                  <div className="product-list js-product-list" data-category="Credit Cards">
                    <ul className="product-list-container">
                      <li className="product-list-item js-product-list-item">
                        <a className="product-list-item__name" href="#">World Mastercard</a>
                        <div className="product-list-item-inner">
                          <div className="product-list-item-content product-list-item-content--image">
                            <a className="product-list-item__image" href="#">
                              <img src="/templates/bank-pro/bank-images/contactless-payments/credit-card-product-pages/best-credit-cards-for-young-adults364a.svg" alt="Oldspring Trust credit card" />
                            </a>
                          </div>
                          <div className="product-list-item-content product-list-item-content--brief">
                            <h4 className="product-list-item__section-title">At a Glance:</h4>
                            <p className="product-list-item__brief">Earn double Mastercard rewards points on hotels, airlines, and restaurants. Exclusive benefits for cardholders, such as Free WIFI, Trip Cancellation and Car Rental Insurance all with no annual fee or balance transfer fee.</p>
                          </div>
                          <div className="product-list-item-content product-list-item-content--rates">
                            <h4 className="product-list-item__section-title">Rates as Low as:</h4>
                            <p className="product-list-item__rate">14.49%</p>
                            <p className="product-list-item__apr">APR</p>
                          </div>
                          <div className="product-list-item-content product-list-item-content--features">
                            <h4 className="product-list-item__section-title">Features:</h4>
                            <p className="product-list-item__features">No Annual Fee; Earn 2 Points for every $1 spent on Travel & Dining, and 1 Point per $1 on all other Purchases; No Foreign Transaction Fees</p>
                          </div>
                        </div>
                      </li>

                      <li className="product-list-item js-product-list-item">
                        <a className="product-list-item__name" href="#">Cash Rewards Mastercard</a>
                        <div className="product-list-item-inner">
                          <div className="product-list-item-content product-list-item-content--image">
                            <a className="product-list-item__image" href="#">
                              <img src="/templates/bank-pro/bank-images/contactless-payments/credit-card-product-pages/best-credit-cards-for-young-adults364a.svg" alt="Oldspring Trust credit card" />
                            </a>
                          </div>
                          <div className="product-list-item-content product-list-item-content--brief">
                            <h4 className="product-list-item__section-title">At a Glance:</h4>
                            <p className="product-list-item__brief">Automatically earn 1.5% cash back on every dollar you spend everywhere with a Oldspring Trust Cash Rewards Mastercard! Cash Rewards can be deposited right into your checking or saving account. All with no annual fee or balance transfer fee.</p>
                          </div>
                          <div className="product-list-item-content product-list-item-content--rates">
                            <h4 className="product-list-item__section-title">Rates as Low as:</h4>
                            <p className="product-list-item__rate">15.49%</p>
                            <p className="product-list-item__apr">APR</p>
                          </div>
                          <div className="product-list-item-content product-list-item-content--features">
                            <h4 className="product-list-item__section-title">Features:</h4>
                            <p className="product-list-item__features">No Annual Fee; 1.5% Cash Back on all Purchases; Easy Redemption</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Credit Cards page created"

# ============================================
# FAQS PAGE
# ============================================
print_header "Creating FAQs page..."

cat > src/app/faqs/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Is the company registered and regulated",
      answer: "Yes, our Company is totally a legal platform licensed by the Securities and Exchange Commission to carry out financial activities in over 105 countries?"
    },
    {
      question: "What is the field of activity of the company?",
      answer: "The company is engaged in cryptocurrency and Forex trading. Our staff of highly qualified traders and financial experts shows high profit rates from year to year. The company's priorities are access to international markets and long-term cooperation with investors."
    },
    {
      question: "Who can be a Customer of Oldspring Trust Bank?",
      answer: "Everyone can be a Customer of Oldspring Trust Bank, but he/she must be not less 18 years old."
    },
    {
      question: "How can I become an investor in the company?",
      answer: "You may become a client of the company and it is totally free of charge. All you need is to sign up and fill all required fields. It takes less than 2 minutes to complete sign up."
    },
    {
      question: "How reliable is the company in terms of security and personal data?",
      answer: "We pay great attention to security and privacy. All information on our website is protected by SSL. We do not divulge any personal data of our customers to third parties. Your participation is strictly confidential."
    },
    {
      question: "Is there a KYC verification process?",
      answer: "Yes, we do require verification documents confirming the identity, address or origin of account owner."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient"
                      style={{backgroundImage: "url('/templates/bank-pro/invest-images/Citadel_AlkemyX_00405_weatlh_kate_1600x650.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Frequently Asked Questions</p>
                      <p className="sub-hero__teaser p">What's on your mind? There are lots of ways to get in touch with us. Search our FAQs</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Frequently Asked Questions">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <h1>Frequently Asked Questions</h1>
                  </div>
                </div>

                <div className="l-bg-gray padding-content" id="faqs">
                  <section className="faq l-contain js-faq" aria-label="FAQ">
                    <div className="faq__inner l-bg-white">
                      {faqs.map((faq, index) => (
                        <div key={index} className="faq__item">
                          <a 
                            className="faq__question js-faq-open" 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault()
                              setOpenIndex(openIndex === index ? null : index)
                            }}
                          >
                            {faq.question}
                          </a>
                          {openIndex === index && (
                            <div className="faq__answer rtf">
                              <p>{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="u-align-center faq__lower">
                        <p>
                          Still have questions?
                          <a href="/customer-support" title="Contact Member Care"> Contact Us.</a>
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "FAQs page created"

# ============================================
# CUSTOMER SUPPORT PAGE
# ============================================
print_header "Creating Customer Support page..."

cat > src/app/customer-support/page.tsx << 'EOF'
'use client'

import Link from 'next/link'

export default function CustomerSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">
              <div className="l-service-search">
                <section className="search-hero js-search-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg search-hero__background-image hero-image-bg--gradient"
                      style={{backgroundImage: "url('/templates/bank-pro/images/assets/citadel-customer-support.jpg')"}}>
                    </div>
                  </div>

                  <div className="search-hero__container">
                    <div className="search-hero__content l-contain">
                      <div className="search-hero__header">
                        <h2 className="search-hero__title">How can we help you today?</h2>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 l-contain">
                <div className="quick-bar quick-bar--service-landing">
                  <div className="quick-bar__wrap">
                    <h2 className="u-align-center h2">Get in Touch With Us</h2>
                    <a href="#" onClick={() => alert('Temporarily unavailable, please use other channels')}
                      className="quick-bar__item" rel="noopener noreferrer" target="_blank">
                      <img src="/templates/bank-pro/images/assets/get-started-chat.svg" alt="" />
                      <div className="quick-bar__text mt-2">
                        <h3 className="quick-bar__item-header">Video Connect</h3>
                      </div>
                    </a>
                    <a className="quick-bar__item" href="mailto:support@oldspringtrust.com">
                      <img src="/templates/bank-pro/images/assets/get-started-email-us.svg" alt="" />
                      <div className="quick-bar__text mt-2">
                        <h3 className="quick-bar__item-header">Email Us</h3>
                      </div>
                    </a>
                    <a className="quick-bar__item" href="mailto:support@oldspringtrust.com">
                      <img src="/templates/bank-pro/images/assets/get-started-visit-us.svg" alt="" />
                      <div className="quick-bar__text mt-2">
                        <h3 className="quick-bar__item-header">Schedule Appointment</h3>
                      </div>
                    </a>
                    <a className="quick-bar__item" href="tel:+447451272406">
                      <img src="/templates/bank-pro/images/assets/get-started-call-us.svg" alt="" />
                      <div className="quick-bar__text mt-2">
                        <h3 className="quick-bar__item-header quick-bar__item-header--phone">Call Us</h3>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="l-frequently-searched">
                <section className="frequently-searched js-frequently-searched l-contain" aria-label="Frequently Searched">
                  <h2 className="frequently-searched__title">Frequently Searched</h2>
                  <ul className="frequently-searched-links mt-3">
                    <li className="frequently-searched__link js-frequently-searched-link"><a href="#">'payment'</a></li>
                    <li className="frequently-searched__link js-frequently-searched-link"><a href="#">'secure access code'</a></li>
                    <li className="frequently-searched__link js-frequently-searched-link"><a href="#">'mobile banking'</a></li>
                  </ul>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Customer Support page created"

# ============================================
# GIVING BACK PAGE
# ============================================
print_header "Creating Giving Back page..."

cat > src/app/giving-back/page.tsx << 'EOF'
import Link from 'next/link'

export default function GivingBackPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient"
                      style={{backgroundImage: "url('/templates/bank-pro/footer-images/giving-back/give_back.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Committed to Giving</p>
                      <p className="sub-hero__teaser p">Oldspring Trust is committed to giving back to the communities where our members live and work. Learn more about our charitable contributions, and community involvement.</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Giving Back">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p>At Oldspring Trust, giving back to the community is a top priority. We do our best to give back and make our community a better place. Learn more about our community-giving programs, charitable contributions, and how we get involved.</p>
                  </div>
                </div>

                <div className="padding-content">
                  <div className="tiles tiles--arrows l-contain mt-3 js-tiles">
                    <div className="js-tiles-container">
                      <div className="tiles__inner js-tile-group">
                        <a className="tile js-tile tile--link" href="#">
                          <h3 className="tile__heading">Oldspring Trust Heart of Learning Award</h3>
                          <p className="tile__body">The Oldspring Trust Heart of Learning Award is a teaching excellence award for Chester County teachers. Learn more about how you can nominate a teacher and the history of the program.</p>
                        </a>
                        <a className="tile js-tile tile--link" href="#">
                          <h3 className="tile__heading">Causes & Charitable Contributions</h3>
                          <p className="tile__body">Learn how Oldspring Trust gives back to the community with financial contributions, volunteering, seminars, and more.</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="l-join-cta content-nav-section" data-short-name="CTA">
                  <section className="join-cta join-cta--primary" aria-label="Join Oldspring Trust">
                    <div className="join-cta-content l-contain u-align-center">
                      <h2 className="join-cta__title">Learn more about Oldspring Trust's charitable donations and the ways we give back.</h2>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Giving Back page created"

# ============================================
# NEWS PAGE
# ============================================
print_header "Creating News page..."

cat > src/app/news/page.tsx << 'EOF'
import Link from 'next/link'

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">
              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient"
                      style={{backgroundImage: "url('/templates/bank-pro/invest-images/Citadel_AlkemyX_00405_weatlh_kate_1600x650.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Financial News & Events</p>
                      <p className="sub-hero__teaser p">All the latest news from Oldspring Trust blog</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Learn & Plan">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <h1>News & Events</h1>
                    {/* TradingView Widget */}
                    <div className="tradingview-widget-container">
                      <div className="tradingview-widget-container__widget"></div>
                      <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js" async>
                        {`{
                          "feedMode": "market",
                          "market": "forex",
                          "colorTheme": "light",
                          "isTransparent": false,
                          "displayMode": "regular",
                          "width": "100%",
                          "height": 830,
                          "locale": "en"
                        }`}
                      </script>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "News page created"

# ============================================
# PRIVACY POLICY PAGE
# ============================================
print_header "Creating Privacy Policy page..."

cat > src/app/privacy-policy/page.tsx << 'EOF'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Online Privacy, Security & Accessibility">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <h1>Online Privacy, Security & Accessibility</h1>
                  </div>
                </div>

                <div className="content-nav-section" data-short-name="Online Privacy, Security & Accessibility">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <h3>Website Accessibility Statement</h3>
                    <p>Oldspring Trust is committed to enhancing our site and increasing accessibility and usability for all of our members. Our accessibility efforts are based on the World Wide Web Consortium's (W3C) Web Content Accessibility Guidelines 2.0 Level AA (WCAG 2.0 AA). Our website will be tested on a periodic basis with assistive technology such as screen readers and screen magnifiers, and with users with disabilities who use these technologies.</p>
                    <p>Please be aware that our efforts are ongoing. If you encounter an accessibility issue, please <a href="/customer-support">Contact Us</a>. We will make all reasonable efforts to make each page of our website accessible for you.</p>

                    <h3>Online Privacy & Security Policy</h3>
                    <p>Oldspring Trust Bank understands the importance of protecting your privacy. This online privacy and security policy describes how Oldspring Trust collects, uses, shares, and protects information when you visit or use https://oldspringtrust.com.</p>

                    <h4>Types of Information We Collect</h4>
                    <p>When you visit and browse the Website or Apps, we are able to collect information that could be reasonably used to indirectly identify you individually, such as your physical location, the device you are using and the Internet Service Provider (ISP) you are using. We can also record the date, time, and pages visited while you are at our site and the type of web browser and operating system you use. We do this to determine how individuals use the Website and services so that we can enhance a user's experience and make the Website and services more useful for customers.</p>

                    <h4>How We Collect Information</h4>
                    <ul>
                      <li><strong>Browser Cookies</strong> – Cookies are pieces of data that are stored directly on your computer, smartphone, or other internet access device. They are assigned by a web server to the browser on your device and allow us to recognize your device and store user preferences for when you return to the Website.</li>
                      <li><strong>IP Address</strong> – Your IP Address is a number automatically assigned to the device you're using by your Internet Service Provider (ISP). An IP address is identified and logged automatically in our server log files whenever a user visits the Website, along with the time of the visit and the page(s) that were visited.</li>
                      <li><strong>Social Security Numbers</strong> – As required by law, in the normal course of business, Oldspring Trust collects Social Security numbers in establishing, maintaining, and servicing member accounts. We implement reasonable measures to protect the confidentiality of Social Security numbers, to prohibit unlawful disclosure of Social Security numbers, and to limit access to Social Security numbers.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Privacy Policy page created"

# ============================================
# CAREERS PAGE
# ============================================
print_header "Creating Careers page..."

cat > src/app/careers/page.tsx << 'EOF'
import Link from 'next/link'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="l-sub-hero">
                <section className="sub-hero hero--image js-hero--image" aria-label="Hero Area">
                  <div className="image-hero js-hero-image-bg">
                    <div className="hero-image-bg main-hero-background main-hero-background--home hero-image-bg--gradient hero-image-bg--gradient-10"
                      style={{backgroundImage: "url('/templates/bank-pro/business-banking/business-banking-sectionlanding-1600x650_NEW_hero.jpg')"}}>
                    </div>
                  </div>
                  <div className="sub-hero-content l-contain">
                    <div className="sub-hero-content-inner">
                      <p className="sub-hero__title mb-1">Join the Oldspring Trust Bank Team</p>
                      <p className="sub-hero__teaser p">As a not-for-profit credit union, we're committed to caring for our people and communities so they can prosper.</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-white u-pos-relative l-z-index-100 u-cf">
                <div className="content-nav-section" data-short-name="Careers">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <p>With <a href="#">positions available</a> in both our corporate and retail offices, Oldspring Trust employees can find the right fit in a variety of remote, hybrid, and in-person settings to create their own version of work-life harmony.</p>
                    <p>The culture at Oldspring Trust Credit Union is all about <a href="/giving-back">giving back</a> to the community where our members live and work. Our team is at the heart of what we do, so we want working here to be just as rewarding as banking here. During this exciting period of growth, we're thrilled to welcome talented, new employees to get involved with our mission of Building Strength Together.</p>
                  </div>
                </div>

                <div className="content-nav-section" data-short-name="">
                  <div className="rtf u-cf padding-content l-contain">
                    <h2>A Great Place to Work</h2>
                    <p>At Oldspring Trust, we recognize that our employees are what make Oldspring Trust not only a great place to bank but also a great place to work. As our company continues to grow, we remain committed to constantly improving our internal culture. It is also the reason we are proud to be a certified Great Place to Work by the <a rel="noopener noreferrer" href="#" target="_blank">Great Places to Work Institute</a>.</p>

                    <h2>Build Your Career</h2>
                    <p>We are committed to hiring qualified and motivated employees at all levels within the organization. Our <a href="#">competitive benefits & compensation packages</a> are designed to support this commitment and to make life easier and happier for employees and their families.</p>

                    <h2>Community Commitment</h2>
                    <p>Oldspring Trust isn't just a business in the community. Our members and employees live and work here, too. And that's what inspires us to <a href="/giving-back">give back</a>. We take part in a wide variety of community initiatives and programs and make a difference in a very real way.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Careers page created"

# ============================================
# EDUCATIONAL ARTICLES
# ============================================
print_header "Creating Educational Articles..."

cat > src/app/how-to-save-for-summer-vacation/page.tsx << 'EOF'
import Link from 'next/link'

export default function HowToSaveForSummerVacationPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="bg-white u-pos-relative u-cf">
                <div className="content-nav-section" data-short-name="How to Save for Summer Vacation">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <h1>How to Start Saving for Summer Vacation</h1>
                  </div>
                </div>

                <section className="article-info js-article-info l-contain mt-1" aria-label="Article Information">
                  <div className="article-info-author article-info-author--image">
                    <img src="/templates/bank-pro/uploads/1682517645_5841179acbe8ed8e2d8e.png" height="200" width="200" className="article-author__image" alt="Icon" />
                    <p className="article-author-details">
                      <span className="article-author__name">Oldspring Trust Financial Tips</span>
                    </p>
                  </div>
                </section>

                <div className="content-nav-section" data-short-name="How to Save for Summer Vacation">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <figure className="u-float-l u-cf">
                      <img src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/1116302.jpg" alt="saving for a summer vacation" />
                    </figure>
                    <p>Summer is almost here and that means the vacation you and your family have been dreaming about all winter is just around the corner. Whether it's an in-state trip to historic Gettysburg, a road trip to New York City or Boston, or a couple of weeks abroad, you've likely put some time into deciding where to go, how to get there, and how much you need to save to make it all happen. But saving for summer vacation isn't easy—especially when you're already putting money aside for big milestones like buying a house, your child's education, or retirement.</p>

                    <h2>1. Create a Vacation Budget You Can Stick to</h2>
                    <p>To start off, you need to figure out everything you'll be paying for—and how much you'll be paying. Have you considered transport costs? What about accommodation and food? Are you planning on a guided tour? Do you need camping equipment? And don't forget about those hidden costs like state taxes or currency exchange fees. Once you've done the math, you'll have a better idea of how much you need to pay upfront (e.g. for flights and reservations) and how much more you'll have to save until you leave.</p>

                    <h2>2. Set Up Vacation Savings Account</h2>
                    <p>One easy thing you can do to start putting money aside is open a savings account specifically for your summer vacation. Like holiday club accounts—which people use to save for gift shopping, traveling, and hosting events—a separate account will protect your vacation fund from being spent elsewhere and let you focus on tracking how close you are to your goal.</p>

                    <h2>3. Cut Back on Expenses</h2>
                    <p>A great summer vacation may mean having to reduce your spending in the months leading up to it. When you're in the planning stages, take some time to review your online account for your spending habits and identify some key areas where you might cut back.</p>

                    <h2>4. Sell Unwanted Items</h2>
                    <p>Decluttering can also help you boost your vacation savings. Take advantage of the spring weather and hold a garage sale to make money on the items you don't use anymore.</p>

                    <h2>5. Make Use of Your Tax Refund</h2>
                    <p>Your tax refund can also contribute to a vacation fund. As long as you file by April 15, it's likely your refund will come in before summer starts.</p>

                    <h2>6. Use Credit Card Rewards</h2>
                    <p>Whether you're booking a flight or a hotel, summer vacation is an ideal time to put your credit card rewards to work. Consider changing your current credit card for a travel rewards program that lines up with your travel style.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "How to Save for Summer Vacation article created"

cat > src/app/simple-ways-to-manage-a-checking-account/page.tsx << 'EOF'
import Link from 'next/link'

export default function SimpleWaysToManageCheckingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="bg-white u-pos-relative u-cf">
                <div className="content-nav-section" data-short-name="How to Manage Your Checking">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <h1>Simple Ways to Manage a Checking Account</h1>
                  </div>
                </div>

                <section className="article-info js-article-info l-contain mt-1" aria-label="Article Information">
                  <div className="article-info-author article-info-author--image">
                    <img src="/templates/bank-pro/uploads/1682517645_5841179acbe8ed8e2d8e.png" height="200" width="200" className="article-author__image" alt="Icon" />
                    <p className="article-author-details">
                      <span className="article-author__name">Oldspring Trust Financial Tips</span>
                    </p>
                  </div>
                </section>

                <div className="content-nav-section" data-short-name="How to Manage Your Checking">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <figure className="u-float-l u-cf">
                      <img src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/8554477.jpg" alt="open a checking account online" />
                    </figure>
                    <p>While you might not often find yourself writing out an actual paper check, you still need a checking account. Having a checking account makes it much easier to get paid and pay your bills. Your debit card enables you to access money through ATM withdrawals and online transfers.</p>

                    <h2>What to Know Before Opening a Checking Account</h2>
                    <p>Most banks offer a variety of checking account options, so it's worth having a clear understanding of exactly what you intend to get out of your account. Some things to consider when choosing a checking account include:</p>
                    <ul>
                      <li>Is there any minimum balance required to open an account?</li>
                      <li>Are there any limitations on checks or debit transactions?</li>
                      <li>Do you want a checking account with or without overdraft protection?</li>
                      <li>How much does it cost to use this account on a monthly, yearly, or per transaction basis?</li>
                    </ul>

                    <h2>Take Charge of Your Records</h2>
                    <p>Because it is a transactional account, funds can flow in and out quickly. It can sometimes be hard to keep track of them all, and if you don't know what's going in and out of your account, it will be difficult to manage it.</p>

                    <h2>Balance Your Account Regularly</h2>
                    <p>Balancing your account helps you stick to your budget and helps you avoid unnecessary charges resulting from bounced checks or overdraft fees.</p>

                    <h2>Keep Your Account Information Protected</h2>
                    <p>Unfortunately, financial fraud remains a reality in our world. Don't take the safety of your account information, especially your PIN numbers and online banking passwords, lightly.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Simple Ways to Manage Checking article created"

cat > src/app/tax-checklist-5-things-to-remember/page.tsx << 'EOF'
import Link from 'next/link'

export default function TaxChecklistPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="l-content-wrap u-cf">
        <div className="l-1-col-master u-cf">
          <main className="l-content-primary">
            <div className="body-content js-body-content">

              <div className="bg-white u-pos-relative u-cf">
                <div className="content-nav-section" data-short-name="Tax Checklist: 5 Things to Remember">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <h1>Tax Checklist: 5 Things to Remember</h1>
                  </div>
                </div>

                <section className="article-info js-article-info l-contain mt-1" aria-label="Article Information">
                  <div className="article-info-author article-info-author--image">
                    <img src="/templates/bank-pro/uploads/1682517645_5841179acbe8ed8e2d8e.png" height="200" width="200" className="article-author__image" alt="Icon" />
                    <p className="article-author-details">
                      <span className="article-author__name">Oldspring Trust Financial Tips</span>
                    </p>
                  </div>
                </section>

                <div className="content-nav-section" data-short-name="Tax Checklist: 5 Things to Remember">
                  <div className="rtf mt-4 mb-2 l-contain">
                    <figure className="u-float-l u-cf">
                      <img src="/templates/bank-pro/learn-and-plan-images/personal-finance-101/unsplash.jpg" alt="Woman working on a laptop" />
                    </figure>
                    <p>No matter who you are or how much experience you have, tax season can feel daunting. There's a lot to remember and a lot of factors to consider while filing.</p>

                    <h2>1. File Your Taxes on Time</h2>
                    <p>This may seem obvious, but filing your taxes by the due date is incredibly important. There are two main penalties in place if you're unable to meet the deadline: the failure to file penalty and the failure to pay penalty.</p>

                    <h2>2. Have Your Personal Information Ready</h2>
                    <p>Not knowing your personal information and the types of taxes you have to pay or claims you are able to file is a common mistake. There are a few key pieces of personal information you should know before filing your taxes.</p>

                    <h2>3. Prepare for Any Increases in Your Taxes</h2>
                    <p>While filing your basic tax returns can be straightforward if you're only receiving one income from a single employer, it can get a little complicated if you have other means of income to declare.</p>

                    <h2>4. Determine if You're Eligible for Deductions</h2>
                    <p>Increases in income from selling your house or getting a raise will increase the amount you pay in your taxes. However, there are some factors of your life which may qualify you to deduct amounts from your taxes as well.</p>

                    <h2>5. Make Sure to Double Check Your Information</h2>
                    <p>Before you file your taxes, be sure to double-check your math and the information on your forms, or consult with an expert on them.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
EOF
print_success "Tax Checklist article created"

# ============================================
# AUTH PAGES
# ============================================
print_header "Creating Authentication pages..."

cat > src/app/auth/login/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <img src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" alt="Oldspring Trust" className="mx-auto h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              defaultValue="demo@oldspringtrust.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              defaultValue="password123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
EOF
print_success "Login page created"

cat > src/app/auth/signup/page.tsx << 'EOF'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <img src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" alt="Oldspring Trust" className="mx-auto h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
EOF
print_success "Signup page created"

# ============================================
# DASHBOARD PAGE
# ============================================
print_header "Creating Dashboard page..."

cat > src/app/dashboard/page.tsx << 'EOF'
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <img src="/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png" alt="Oldspring Trust" className="h-10" />
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Demo User</span>
              <button
                onClick={handleLogout}
                className="text-blue-600 hover:text-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Welcome back, Demo User
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-3xl font-bold text-gray-900">$755,300.00</p>
            <p className="text-xs text-gray-500 mt-1">Routing #: 655205039</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-3xl font-bold text-gray-900">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">Monthly Deposits</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">All Time</p>
            <p className="text-3xl font-bold text-gray-900">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">Total Volume</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Account Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Checking Account</span>
                <span className="font-semibold">$755,300.00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Savings Account</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Credit Card</span>
                <span className="font-semibold text-green-600">$0.00</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <p className="text-gray-500 text-center py-8">No recent transactions</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/payments" className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow">
              <span className="block text-2xl mb-2">💰</span>
              <span className="text-sm font-medium">Make Payment</span>
            </Link>
            <Link href="/transfers" className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow">
              <span className="block text-2xl mb-2">💸</span>
              <span className="text-sm font-medium">Transfer</span>
            </Link>
            <Link href="/statements" className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow">
              <span className="block text-2xl mb-2">📄</span>
              <span className="text-sm font-medium">Statements</span>
            </Link>
            <Link href="/customer-support" className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow">
              <span className="block text-2xl mb-2">💬</span>
              <span className="text-sm font-medium">Support</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
EOF
print_success "Dashboard page created"

# ============================================
# FINAL SUMMARY
# ============================================
echo ""
echo "🎉 ==============================================="
echo "🎉 ALL PAGES GENERATED SUCCESSFULLY!"
echo "🎉 ==============================================="
echo ""
echo "📊 Generated Pages:"
echo "   ✅ Homepage"
echo "   ✅ About"
echo "   ✅ Borrow"
echo "   ✅ Save"
echo "   ✅ Invest"
echo "   ✅ Insure"
echo "   ✅ Learn & Plan"
echo "   ✅ Payments"
echo "   ✅ Business Banking"
echo "   ✅ Credit Cards"
echo "   ✅ FAQs"
echo "   ✅ Customer Support"
echo "   ✅ Giving Back"
echo "   ✅ News"
echo "   ✅ Privacy Policy"
echo "   ✅ Careers"
echo "   ✅ How to Save for Summer Vacation"
echo "   ✅ Simple Ways to Manage Checking"
echo "   ✅ Tax Checklist"
echo "   ✅ Login"
echo "   ✅ Signup"
echo "   ✅ Dashboard"
echo ""
echo "📁 All image paths point to: /templates/bank-pro/"
echo ""
echo "🚀 Next steps:"
echo "   1. Copy your templates-bank-pro folder to public/templates/bank-pro/"
echo "   2. Run: npm run dev"
echo "   3. Visit: http://localhost:3000"
echo ""
echo "✅ Complete! Your Oldspring Trust Bank website is ready!"
echo ""

exit 0
EOF

# Make the script executable
chmod +x scripts/generate_all_pages.sh

echo "✅ Page generation script created at scripts/generate_all_pages.sh"
echo ""
echo "To run the script:"
echo "  cd online-banking-platform"
echo "  ./scripts/generate_all_pages.sh"
echo ""
echo "After generation, copy your templates folder:"
echo "  cp -r /path/to/templates-bank-pro/* public/templates/bank-pro/"
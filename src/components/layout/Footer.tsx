import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img 
              src="/images/logo/logo.png" 
              alt="Oldspring Trust" 
              className="h-8 w-auto mb-4 brightness-0 invert"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.className = 'text-white font-bold text-xl';
                  fallback.textContent = 'Oldspring Trust';
                  parent.prepend(fallback);
                }
              }}
            />
            <p className="text-gray-400 text-sm">
              Building financial strength together since 1945.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-soft-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-soft-gold transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-soft-gold transition-colors">Careers</Link></li>
              <li><Link href="/news" className="hover:text-soft-gold transition-colors">News</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/faqs" className="hover:text-soft-gold transition-colors">FAQs</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-soft-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-soft-gold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📍 100 Bishopsgate</li>
              <li>London, EC2N 4AG</li>
              <li>📞 +44 20 1234 5678</li>
              <li>✉️ support@oldspringtrust.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Oldspring Trust Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

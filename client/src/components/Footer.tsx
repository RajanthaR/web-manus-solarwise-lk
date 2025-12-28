import { Sun, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">SolarWise</span>
                <span className="text-xs text-primary ml-1">LK</span>
              </div>
            </div>
            <p className="text-sm sinhala">
              ශ්‍රී ලංකාවේ විශ්වාසනීය <span className="tech-term">Solar</span> බලශක්ති වේදිකාව. 
              හොඳම <span className="tech-term">Packages</span> සොයා ගන්න.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 sinhala">ඉක්මන් සබැඳි</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/packages" className="hover:text-primary transition-colors sinhala">
                  <span className="tech-term">Packages</span>
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-primary transition-colors sinhala">
                  <span className="tech-term">ROI Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/hardware" className="hover:text-primary transition-colors sinhala">
                  <span className="tech-term">Hardware</span> සමාලෝචන
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-primary transition-colors sinhala">
                  <span className="tech-term">AI</span> උපදේශක
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4 sinhala">සම්පත්</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer sinhala">
                  <span className="tech-term">CEB Tariff</span> තොරතුරු
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer sinhala">
                  <span className="tech-term">Net Metering</span> මාර්ගෝපදේශය
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer sinhala">
                  <span className="tech-term">Solar</span> FAQ
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 sinhala">සම්බන්ධ වන්න</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@solarwise.lk</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="sinhala">කොළඹ, ශ්‍රී ලංකාව</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm sinhala">
            © 2025 SolarWise LK. සියලුම හිමිකම් ඇවිරිණි.
          </p>
          <div className="flex gap-4 text-sm">
            <span className="hover:text-primary transition-colors cursor-pointer sinhala">
              පෞද්ගලිකත්ව ප්‍රතිපත්තිය
            </span>
            <span className="hover:text-primary transition-colors cursor-pointer sinhala">
              සේවා කොන්දේසි
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Clock } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center bg-navy-light/20 border border-white/5 p-12 rounded-3xl backdrop-blur-xl">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Clock className="text-accent" size={40} />
        </div>
        <h1 className="text-3xl font-bold font-outfit text-white mb-4">Registration Pending</h1>
        <p className="text-white/60 leading-relaxed mb-10">
          Your account has been created successfully! However, to ensure security, an administrator must approve your access before you can log in.
        </p>
        <Link 
          href="/"
          className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition-all"
        >
          Return to Website
        </Link>
      </div>
    </div>
  );
}

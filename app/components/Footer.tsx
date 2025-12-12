export default function Footer() {
    return (
        <footer className="border-t border-muted bg-muted/50 py-12">
            <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
                <div>
                    <h3 className="font-bold text-lg mb-4">Ariana Bandenservice</h3>
                    <p className="text-muted-foreground">
                        Premium tire services for all vehicle types. Professional installation, balancing, and repair.
                    </p>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Contact</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>12 Street Name, City, Country</li>
                        <li>+31 6 12345678</li>
                        <li>info@arianabandenservice.com</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Hours</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>Mon - Fri: 09:00 - 18:00</li>
                        <li>Sat: 09:00 - 17:00</li>
                        <li>Sun: Closed</li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-8 pt-8 border-t border-muted/50 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Ariana Bandenservice. All rights reserved.</p>
            </div>
        </footer>
    );
}

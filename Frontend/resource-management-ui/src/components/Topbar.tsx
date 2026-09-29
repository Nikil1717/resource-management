import { Bell } from "lucide-react";

interface TopbarProps {
    title: string;
    subtitle: string;
}

function Topbar({
    title,
    subtitle,
}: TopbarProps) {

    return (
        <header className="topbar">

            <div>

                <h1>
                    {title}
                </h1>

                <p>
                    {subtitle}
                </p>

            </div>

            <div className="topbar-actions">

                <button
                    className="icon-button"
                    type="button"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                </button>

                <div className="topbar-avatar">
                    CD
                </div>

            </div>

        </header>
    );
}

export default Topbar;
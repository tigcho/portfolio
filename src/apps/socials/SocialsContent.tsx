type Social = {
	name: string;
	url: string;
	icon: string;
	username: string;
	description: string;
};

const SOCIALS: Social[] = [
	{ name: "Instagram", url: "https://www.instagram.com/tigcho", icon: "📷", username: "@tigcho", description: "Photos & stories" },
	{ name: "Letterboxd", url: "https://letterboxd.com/tigcho/", icon: "🎬", username: "tigcho", description: "Film diary & reviews" },
	{ name: "Last.fm", url: "https://www.last.fm/user/tigcho", icon: "🎵", username: "tigcho", description: "Music scrobbles" },
	{ name: "StoryGraph", url: "https://app.thestorygraph.com/profile/tigcho", icon: "📚", username: "tigcho", description: "Book tracking" },
	{ name: "GitHub", url: "https://github.com/tigcho", icon: "💻", username: "tigcho", description: "Code & projects" },
	{ name: "RateYourMusic", url: "https://rateyourmusic.com/~tigchoo", icon: "💿", username: "tigchoo", description: "Album ratings" },
];

export default function SocialsContent() {
	return (
		<div className="app-content">
			<div className="app-header">
				<div>
					<div className="app-title">Connect</div>
					<div className="app-subtitle">Find me on these platforms</div>
				</div>
			</div>
			<div className="socials-grid">
				{SOCIALS.map((social) => (
					<a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="social-card">
						<div className="social-icon">{social.icon}</div>
						<div className="social-info">
							<div className="social-name">{social.name}</div>
							<div className="social-username">{social.username}</div>
							<div className="social-description">{social.description}</div>
						</div>
						<div className="social-arrow">→</div>
					</a>
				))}
			</div>
		</div>
	);
}

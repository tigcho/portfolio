export default function SocialsContent() {
	const socials = [
		{
			name: "Instagram",
			url: "https://www.instagram.com/tigcho",
			icon: "📷",
			username: "@tigcho",
			description: "Photos & stories",
		},
		{
			name: "Letterboxd",
			url: "https://letterboxd.com/tigcho/",
			icon: "🎬",
			username: "tigcho",
			description: "Film diary & reviews",
		},
		{
			name: "Last.fm",
			url: "https://www.last.fm/user/tigcho",
			icon: "🎵",
			username: "tigcho",
			description: "Music scrobbles",
		},
		{
			name: "StoryGraph",
			url: "https://app.thestorygraph.com/profile/tigcho",
			icon: "📚",
			username: "tigcho",
			description: "Book tracking",
		},
		{
			name: "GitHub",
			url: "https://github.com/tigcho",
			icon: "💻",
			username: "tigcho",
			description: "Code & projects",
		},
		{
			name: "MyAnimeList",
			url: "https://myanimelist.net/profile/Tigcho",
			icon: "🍥",
			username: "Tigcho",
			description: "Anime & manga list",
		},
		{
			name: "Steam",
			url: "https://steamcommunity.com/profiles/76561199206138363/",
			icon: "🎮",
			username: "tigcho",
			description: "Gaming profile",
		},
		{
			name: "RateYourMusic",
			url: "https://rateyourmusic.com/~tigchoo",
			icon: "💿",
			username: "tigchoo",
			description: "Album ratings",
		},
	];

	return (
		<div className="socials-content">
			<div className="socials-header">
				<h2 className="socials-title">Connect with me</h2>
				<p className="socials-subtitle">Find me on these platforms</p>
			</div>

			<div className="socials-grid">
				{socials.map((social) => (
					<a
						key={social.name}
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						className="social-card"
					>
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

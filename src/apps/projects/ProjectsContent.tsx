type Project = {
	name: string;
	description: string;
	icon: string;
	tags: string[];
	link: string;
	linkText: string;
};

const PROJECTS: Project[] = [
	{
		name: "Active Directory Lab",
		description: "A pentesting lab environment built with infrastructure-as-code. Features Windows Active Directory, Kali Linux, and automated provisioning.",
		icon: "🖥️",
		tags: ["Ansible", "Terraform", "Packer", "AWS", "Active Directory"],
		link: "https://github.com/tigcho/issp",
		linkText: "View on GitHub",
	},
	{
		name: "Shufflies '23",
		description: "Letterboxd Wrapped for a Discord film club. Visualizes movie recommendations and reviews from a community event.",
		icon: "🎬",
		tags: ["Web", "Data Visualization", "Letterboxd"],
		link: "https://tigcho.github.io/shufflies23/",
		linkText: "View Site",
	},
	{
		name: "Final Destination",
		description: "An original screenplay I wrote with a friend.",
		icon: "📝",
		tags: ["Writing", "Creative"],
		link: "https://drive.google.com/file/u/0/d/1-doxAfpD-6I8CfS7tBgtrWAC31bFbSPz/view?pli=1",
		linkText: "Read on Google Drive",
	},
	{
		name: "My PC Build",
		description: "Current desktop setup and hardware configuration.",
		icon: "🔧",
		tags: ["Hardware", "PC Build"],
		link: "https://pcpartpicker.com/list/wNNtkJ",
		linkText: "View on PCPartPicker",
	},
];

export default function ProjectsContent() {
	return (
		<div className="app-content">
			<div className="app-header">
				<div>
					<div className="app-title">Projects</div>
					<div className="app-subtitle">Things I've built and created</div>
				</div>
			</div>
			<div className="projects-list">
				{PROJECTS.map((project) => (
					<div key={project.name} className="project-card">
						<div className="project-card-header">
							<span className="project-icon">{project.icon}</span>
							<h3 className="project-name">{project.name}</h3>
						</div>
						<p className="project-description">{project.description}</p>
						<div className="project-tags">
							{project.tags.map((tag) => (
								<span key={tag} className="project-tag">{tag}</span>
							))}
						</div>
						<a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
							{project.linkText} →
						</a>
					</div>
				))}
			</div>
		</div>
	);
}

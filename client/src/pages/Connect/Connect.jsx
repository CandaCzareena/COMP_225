import './Connect.css';

function Connect() {
  const peers = [
    { id: 1, name: "Emily Zhao", program: "Software Engineering", skills: ["Java", "C#", "SQL"], type: "Study Partner" },
    { id: 2, name: "Marcus Johnson", program: "Health Informatics", skills: ["Python", "Data Analysis"], type: "Peer Tutor" },
    { id: 3, name: "Carlos Estévez", program: "Cyber Security", skills: ["Networking", "Linux Core"], type: "Study Partner" }
  ];

  return (
    <div className="connect-page">
      <div className="page-header">
        <h2>
          <svg className="header-icon"><use href="/icons.svg#connect-icon" /></svg>
          Connect &amp; Study Hub
        </h2>
        <p>Find peer study groups, match with project teammates, or look for student mentors.</p>
      </div>

      <div className="peers-grid">
        {peers.map(peer => (
          <div key={peer.id} className="peer-card">
            <div className="peer-badge" data-type={peer.type}>{peer.type}</div>
            <h3>{peer.name}</h3>
            <p className="peer-sub">{peer.program}</p>
            <div className="skills-tags">
              {peer.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
            <button className="connect-action-btn">Send Message</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Connect;
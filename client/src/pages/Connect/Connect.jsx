import './Connect.css';

function Connect({ connectedUsers = [], onStartChat }) {
  const defaultPeers = [
    { id: 1, name: "Emily Zhao", program: "Software Engineering", skills: ["Java", "C#", "SQL"], type: "Study Partner" },
    { id: 2, name: "Marcus Johnson", program: "Health Informatics", skills: ["Python", "Data Analysis"], type: "Peer Tutor" },
    { id: 3, name: "Carlos Estévez", program: "Cyber Security", skills: ["Networking", "Linux Core"], type: "Study Partner" }
  ];

  // Map users connected from Student Directory into peer card format
  const formattedConnectedPeers = connectedUsers.map((u) => ({
    id: u._id || u.id,
    name: u.name || u.username || 'Student',
    program: u.email || 'Centennial Student',
    skills: ['Connected'],
    type: 'Connected Student',
    userObj: u,
  }));

  // Show connected peers first, followed by default study partners
  const allPeers = [...formattedConnectedPeers, ...defaultPeers];

  const handleSendMessage = (peer) => {
    const recipient = peer.userObj || {
      _id: peer.id,
      name: peer.name,
      email: peer.program
    };
    if (onStartChat) onStartChat(recipient);
  };

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
        {allPeers.map((peer) => (
          <div key={peer.id} className="peer-card">
            <div className="peer-badge" data-type={peer.type}>{peer.type}</div>
            <h3>{peer.name}</h3>
            <p className="peer-sub">{peer.program}</p>
            <div className="skills-tags">
              {peer.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
            <button 
              className="connect-action-btn"
              onClick={() => handleSendMessage(peer)}
            >
              Send Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Connect;
import PropTypes from 'prop-types'
import React from 'react'
import { Link, graphql, StaticQuery } from "gatsby"
import { withPrefix } from "gatsby"


class Main extends React.Component {
  render() {
    const splatUrl = withPrefix('/splats/gs_PC_gaming.compressed.ply')
    const viewerUrl = `${withPrefix('/splat-viewer/')}${`?url=${encodeURIComponent(splatUrl)}`}`
    
    let close = (
      <button
        type="button"
        className="close"
        aria-label="Close panel"
        onClick={() => {
          this.props.onCloseArticle()
        }}
      ></button>
    )

    return (
      <StaticQuery
      query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
          nodes {
            excerpt
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
              description
            }
            fields {
              slug
            }
            id
          }
        }
      }
    `}
    render={data => (
      <React.Fragment>
      <section
        className="home-journal"
        aria-labelledby="journal-title"
        style={this.props.timeout ? { display: 'none' } : {}}
      >
        <header className="journal-heading">
          <div>
            {/* <span className="section-index">01 / FIELD NOTES</span> */}
            <h2 id="journal-title">Latest writing</h2>
          </div>
          <p>Notes on AI, robotics, engineering, and the things worth building.</p>
        </header>
        <ol className="journal-list">
          {
            data.allMarkdownRemark.nodes.map((post, index) => {
              const title = post.frontmatter.title || post.fields.slug

              return (
                <li key={post.id}>
                  <Link
                    to={post.fields.slug}
                    itemScope
                    itemType="http://schema.org/Article"
                    className="journal-entry"
                  >
                    <span className="entry-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="entry-copy">
                      <span className="entry-meta">{post.frontmatter.date}</span>
                      <span className="entry-title" itemProp="headline">{title}</span>
                      <span
                        className="entry-excerpt"
                        dangerouslySetInnerHTML={{ __html: post.frontmatter.description || post.excerpt }}
                        itemProp="description"
                      />
                    </span>
                    <span className="entry-arrow" aria-hidden="true">&#8599;</span>
                  </Link>
                </li>
              )
            })
          }
        </ol>
      </section>
      <div
        ref={this.props.setWrapperRef}
        id="main"
        style={this.props.timeout ? { display: 'flex' } : { display: 'none' }}
      >
        <article
          id="work"
          className={`${this.props.article === 'work' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Work</h2>
          <ol>
            <li>
              <h3>LIP-Loc: LiDAR Image Pretraining for Cross-Modal Localization</h3>
              We apply CLIP-like contrastive symmetric loss
              using batch construction technique to the domains of 2D image and 3D LiDAR points on the task of cross-modal localization.
              WACV 2024 Workshop on Large Language and Vision Models for Autonomous Driving<br/> 
              Training using Pytorch, <br/>  
              <a href='https://github.com/Shubodh/lidar-image-pretrain-VPR'>Github Link</a>
            </li>
            <br/>
            <li>
              <h3>Nano GPT</h3>
              Implemented a Decoder-only Transformer (GPT) from scratch using PyTorch. Followed @karpathy’s video lecture <br/>  
              <a href='https://github.com/husainhz7/nanogpt-hhz'>Github Link</a>
            </li>
            <br/>
            <li>
            <h3>Deep Reinforcement Learning for Autonomous Underwater Vehicles  </h3>
              <p>
              Trained a deep reinforcement agent to control an AUV. Used the 
              Proximal Policy Optimization algorithm for learning. Agent can
              orient and reach a small red buoy successfully. Simulated and trained
              the model in Unity Game Engine. Major Project of Bachelors degree<br/>
              Simulation and training using Unity3D ml-agents <br/>
              </p>
              <iframe width="560" height="315" 
                src="https://www.youtube.com/embed/_IkSe-zG4qA" 
                title="YouTube video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe> <br/>
              <a href= "https://github.com/husainhz7/AUV-FinalYear-Unity">Github link</a>
            </li>
            <br/>
            <li>
              <h3>Camera Tuning AI trained using Deep Reinforcement learning</h3>
              Trained a deep reinforcement agent to tune the white- balance setting
              of an Android Camera. The agent attempts to replicate a manually
              adjusted photo. Captured photos are sent to the PC for training and 
              inference. Minor Project for Bachelors degree. <br/> 
              Training using Keras, image sent over sockets <br/>  
            </li>
            <br />
            <li>
              <h3>Augmented Reality Events App </h3>
              Designed a system for rendering AR elements on stages for concerts
              and festivals. Won first place of the Hackathon with prizes worth ₹ 15,000. Was team
              lead <br/>
              Tech Stack: Unity, ARCore <br/>
              <a href="https://github.com/husainhz7/Event-Fx">Github link</a><br/>
              </li>
              <br/>
            <li>
              <h3>Ludum jam 46, La Revolution</h3>
              Made a game in 3 days which features a gun to make people join the revolution. 
              Made in a top down style. 
              <a href="https://ldjam.com/events/ludum-dare/46/la-revolution"> Play here </a> <br/>
            </li>
            <br />
            <li>
              <h3>Shopify Extension to Measure Clothes measurement</h3>
              Uses tensorflow.js to approximate body measurements using the webcam. 
              Can be used as an iframe in a shopify store. Currently unsupported 
              <a href="https://apps.shopify.com/body-measure"> Check it out here </a> <br/>
            </li>
            <br/>
          </ol>
          {close}
        </article>

        <article
          id="about"
          className={`about-article ${this.props.article === 'about' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">About</h2>
          {/* <span className="image main">
            <img src={pic03} alt="" />
          </span> */}
          <div className="about-layout">
          <div className="about-copy">
          <p>
            <p>
            Software Engineer 2 at Microsoft. Currently working for the Project Manager Agent in Teams. Evaluating MCPs. I have built LLM orchestration for executing Tasks from Teams. Led the Data Engineering crew for Planner. Improved pipelines that process PBs of User logs using spark for Business metrics. Built REST APIs, messaging systems to enhance shared task lists across distributed instances, using ASP.NET.
            </p>
            <p>
            Building home robotics using ROS, Jetson Nano, and custom PCBs. Trying to SLAM using just stereo cameras. Building the memory system for robots for the home.
            </p>
            <p>
            Was a hobbyist Game developer, huge fan of single player experiences. Experienced in Unity3D. 
            Dabbled in Artificial neural networks and Deep Reinforcement Learning in Unity. Used Pytorch, Unity ml-agents. 
            </p>
            <p>
            Made Augmented Reality apps using ArCore in Unity. Deeply intereseted in Mixed Reality, bullish on its ability to replace the smartphone.
            </p>
          <p>
            <a href='https://drive.google.com/file/d/1-_AOHUlKklgeKla8eLkOyx1DnsLDg27e/view?usp=drive_link'>Resume PDF</a>
          </p>
          <p>
            Bullish and interested in projects on 
            <ul>
              <li>
                Learning-based approaches for automation. Robotics for home
              </li>
              <li>
                Shared mirror worlds: A Information rich, virtual simiulation of the world. 3D Gaussian splats and Maps.
              </li>
              <li>
                Creator Economy, power to the masses!
              </li>
              <li>
                Metaverse interactions, tackling real-time synchronous internet
              </li>
            </ul>
          </p>
          <table>
            <tr>
            <td>
                <p>
                  Books:
                  <li>
                    Profiles of the Future
                  </li>
                  <li>
                    Creative selection 
                  </li>
                  <li>
                    The Dream Machine
                  </li>
                  <li>
                    Dune
                  </li>
                  <li>
                    Inside the Googleplex
                  </li>
                  <li>
                    The Things We Make
                  </li>
                  <li>
                    Competing Against Luck
                  </li>
                </p>
              </td>

              <td>
              <p>
                  Games:
                  <li>
                    Half Life
                  </li>
                  <li>
                    Undertale
                  </li>
                  <li>
                    Red Dead Redemption 2
                  </li>
                  <li>
                    Doom
                  </li>
                  <li>
                    Indiana Jones and the Great Circle
                  </li>
                  <li>
                    Cyberpunk 2077
                  </li>
                  <li>
                    No Man's Sky
                  </li>
                  <li>
                    Age of Empires IV
                  </li>
              </p>
              <p>
                Media
                <ul>
                  <li>
                    Three body problem 
                  </li>
                  <li>
                    Better Call Saul 
                  </li>
                  <li>
                    Attack On Titan
                  </li>
                  <li>
                    Parasite
                  </li>
                  <li>
                    Dwarkesh Patel
                  </li>
                  <li>
                    ...
                  </li>
                </ul>
              </p>
              </td>
              
            </tr>
          </table>
          </p>
          </div>
          <aside className="about-splat">
            <h3>My Current Desk!</h3>
            <iframe
              title="PC gaming Gaussian splat"
              src={viewerUrl}
              loading="lazy"
              allow="fullscreen"
              allowFullScreen
            />
          </aside>
          </div>
          {close}
        </article>

        <article
          id="contact"
          className={`${this.props.article === 'contact' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Contact</h2>
          <ul className="icons">
            <li>
              <a
                href="https://twitter.com/husainzaidi"
                className="icon fa-twitter"
              >
                <span className="label">Twitter</span>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/channel/UCWYArmK19PZ4fikClJW7REA" className="icon fa-youtube">
                <span className="label">Youtube</span>
              </a>
            </li>
            <li>
              <a href="https://instagram.com/husainzaidi_" className="icon fa-instagram">
                <span className="label">Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/husain-zaidi"
                className="icon fa-github"
              >
                <span className="label">GitHub</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/husain-zaidi/"
                className="icon fa-linkedin"
              >
                <span className="label">LinkedIn</span>
              </a>
            </li>
          </ul>
          {close}
        </article>
      </div>
      </React.Fragment>
    )}
    />)
  }
}

Main.propTypes = {
  route: PropTypes.object,
  article: PropTypes.string,
  articleTimeout: PropTypes.bool,
  onCloseArticle: PropTypes.func,
  timeout: PropTypes.bool,
  setWrapperRef: PropTypes.func.isRequired,
  data: PropTypes.any,
  location: PropTypes.any,
}

export default Main

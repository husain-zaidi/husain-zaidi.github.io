import React from 'react'
import Layout from '../components/layout'

import Header from '../components/Header'
import Main from '../components/Main'
import Footer from '../components/Footer'
import urduNotebook from '../images/urdu-notebook.webp'
import pen from '../images/pen.png'
import teaCup from '../images/tea-cup.webp'
import planter from '../images/planter.webp'
import compass from '../images/compass.webp'
import crowbar from '../images/crowbar.webp'


class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isArticleVisible: false,
      timeout: false,
      articleTimeout: false,
      article: '',
      loading: 'is-loading'
    }
    this.handleOpenArticle = this.handleOpenArticle.bind(this)
    this.handleCloseArticle = this.handleCloseArticle.bind(this)
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.isPlaying = false
  }

  componentDidMount () {
    this.timeoutId = setTimeout(() => {
        this.setState({loading: ''});
    }, 100);
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount () {
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleOpenArticle(article) {
    this.setState({
      isArticleVisible: true,
      timeout: true,
      articleTimeout: true,
      article
    })
  }

  handleCloseArticle() {
    this.setState({
      isArticleVisible: false,
      timeout: false,
      articleTimeout: false,
      article: ''
    })
  }

  handleClickOutside(event) {
   
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.isArticleVisible) {
        this.handleCloseArticle();
      }
    }
  }

  render() {
    return (
      <Layout location={this.props.location}>
        <div className={`body ${this.state.loading} ${this.state.isArticleVisible ? 'is-article-visible' : ''}`}>
          <img
            className="edge-object edge-object--pen"
            src={pen}
            alt=""
            aria-hidden="true"
          />
          <img
            className="edge-object edge-object--urdu-notebook"
            src={urduNotebook}
            alt=""
            aria-hidden="true"
          />
          <img
            className="edge-object edge-object--tea-cup"
            src={teaCup}
            alt=""
            aria-hidden="true"
          />
          <img
            className="edge-object edge-object--planter"
            src={planter}
            alt=""
            aria-hidden="true"
          />
          <img
            className="edge-object edge-object--compass"
            src={compass}
            alt=""
            aria-hidden="true"
          />
          <img
            className="edge-object edge-object--crowbar"
            src={crowbar}
            alt=""
            aria-hidden="true"
          />
          <div id="wrapper">
            <Header onOpenArticle={this.handleOpenArticle} timeout={this.state.timeout} />
            <Main
              isArticleVisible={this.state.isArticleVisible}
              timeout={this.state.timeout}
              articleTimeout={this.state.articleTimeout}
              article={this.state.article}
              onCloseArticle={this.handleCloseArticle}
              setWrapperRef={this.setWrapperRef}
            />
          </div>
          <Footer timeout={this.state.timeout} />
          <div id="bg"></div>
        </div>
      </Layout>
    )
  }
}

export default IndexPage

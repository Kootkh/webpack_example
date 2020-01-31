import * as $ from 'jquery'
import Post from '@models/post'
//import json from '@data/data.json'
//import xml from '@data/data.xml'
//import csv from '@data/data.csv'
import WebpackLogo from '@img/webpack-logo.png'
import React from 'react'
import {render} from 'react-dom'
import '@/babel'
import '@styles/styles.css'
import '@styles/styles.less'
import '@styles/styles.scss'

const post = new Post('Webpack post Title', WebpackLogo)

$('pre').addClass('code2').html(post.toString())

const App = () => (
  <div className="container">
    <h1>Webpack examples 2020</h1>
    <hr />
    <div className="logo" />
    <hr />
    <pre />
    <hr />
    <div className="box">
      <h2>LESS PREPROCESSING</h2>
    </div>
    <hr />
    <div className="card">
      <h2>SCSS PREPROCESSING</h2>
    </div>
  </div>
)

render(<App />, document.getElementById('app'))

//console.log('Post to String:', post.toString())

//console.log('JSON:',json)
//console.log('XML:',xml)
//console.log('CSV:',csv)
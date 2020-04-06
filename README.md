## NLP Multiple Choice Widget

This widget is designed to be injectable within web games. It displays simple NLP data labeling tasks to game players.

## Get Started

- In root dir, yarn install
- yarn start

## To Deploy To AWS S3

- Make sure aws-cli is installed
- In root dir, yarn build
- yarn deploy

## Integrate to Website

Include those tags within the host HTML file.
```html
<div id="lambda-target" api_id="hello world"></div>
<script src="https://widget-deployment.s3-us-west-1.amazonaws.com/bundle.js"></script>
```

## Project Roadmap
- [ ] Dynamically render multi-class / single-class selection UI
- [ ] Handle User Submission
- [ ] Create Submission UI
- [ ] Make sure CSS does not affect target HTML
- [ ] Re-load Widget from target HTML

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
<div id="lambda-target" api_id="1234567812345678"></div>
<script src="https://widget-deployment.s3-us-west-1.amazonaws.com/bundle.js"></script>
```

Then you can trigger the widget by calling the following function:
```javascript
window.lambdaWidget.openModal();
```

## To-Do

- [ ] Dynamically render multi-class / single-class selection UI
- [ ] Show error message when empty

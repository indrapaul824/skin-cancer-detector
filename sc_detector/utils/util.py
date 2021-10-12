from IPython.core.display import display_javascript
import imutils
import numpy as np
from IPython.display import display, Javascript
from base64 import b64decode


class Json(object):
    def __init__(self, json):
        self.json = json

    def _repr_pretty_(self, pp, cycle):
        import json
        pp.text(json.dumps(self.json, indent=2))

    def __repr__(self):
        return str(self.json)


d = Json({1: 2, 3: {4: 5}})
print(d)
display_javascript()

js = Javascript('''
    async function takePhoto() {
      const div = document.createElement('div');
      const capture = document.createElement('button');
      capture.textContent = 'Capture';
      div.appendChild(capture);
      }
    ''')

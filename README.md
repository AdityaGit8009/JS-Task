# JS-Task

Practice JavaScript in the browser with twenty small exercises covering events, forms, numbers, lists, and images. The home page also contains a student form. Submit a record, edit a field, then use **Copy submitted details** to see which values were saved. [Open the live exercise directory](https://adityagit8009.github.io/JS-Task/#exercises)

## Run locally

Open `index.html` in a recent browser and use **Browse the 20 JavaScript exercises**. Every exercise has a link back to the directory. The HTML, JavaScript, styles, and images are included in the checkout.

To serve the pages over HTTP, run this command from the repository root and open the local site. [Open the local site on port 8000](http://127.0.0.1:8000/)

```sh
python -m http.server 8000 --bind 127.0.0.1
```

## Exercise guide

| No. | Try it | Source |
| --- | --- | --- |
| 1 | Generate ten multiples of a negative number or a fraction. | [Multiplication table](task1.html) |
| 2 | Try five arithmetic operations with decimals and a zero divisor. | [Arithmetic calculator](task2.html) |
| 3 | Enter equal heights to see who shares the maximum. | [Compare three heights](task3.html) |
| 4 | Reverse the two panels with either button. | [Swap two panels](task4.html) |
| 5 | Change the sample image’s height and width in pixels. | [Resize an image](task5.html) |
| 6 | Choose a country and find its matching entry in the source list. | [Build a country dropdown](task6.html) |
| 7 | Color all data rows, then switch to odd or even positions. | [Color table rows](Task7.html) |
| 8 | Pick a color and compare the swatch with its hex value. | [Change a color swatch](task8.html) |
| 9 | Submit a blank name, correct it, and press Enter. | [Validate a name](task9.html) |
| 10 | Copy the available names and change the selected one. | [Copy dropdown options](task10.html) |
| 11 | Choose several entries to assemble a menu in order. | [Build a menu](task11.html) |
| 12 | Reveal the names by hovering, tapping, or pressing Enter. Press Escape to close. | [Names dropdown](task12.html) |
| 13 | Insert an option at three positions, clear the list, or remove and restore it. | [Edit dropdown options](task13.html) |
| 14 | Toggle odd and even list highlights independently. | [Highlight odd and even items](task14.html) |
| 15 | Move through six colors with the arrow keys and watch the preview. | [Explore six colors](task15.html) |
| 16 | Select a local file to check its PDF, DOC, or DOCX extension. | [Check a résumé file](task16.html) |
| 17 | Tab through the text field and compare its focused and unfocused states. | [Focus and blur](task17.html) |
| 18 | Check six digits with a nonzero first digit. | [Indian PIN code validation](task18.html) |
| 19 | Try a domain on its own or add a web scheme, port, path, or query. | [Website URL validation](task19.html) |
| 20 | Show, hide, or toggle the stadium image. | [Show or hide an image](task20.html) |

## Project structure

- `index.html` contains the student form and the exercise directory.
- Each numbered HTML file contains its exercise markup and JavaScript together. The seventh file uses a capital T in `Task7.html`.
- `assets/site.css` provides shared layout, form, focus, and navigation styles.
- The WebP files in the repository root include the two sample images used in exercises 5 and 20.
- `tests/` contains Playwright checks for page loading, navigation, narrow screens, and the exercise interactions.

## Browser tests

Use Node.js 20 or later for the test suite. From the repository root, install the locked development dependencies and the Chromium browser, then run the checks.

```sh
npm ci
npx playwright install chromium
npm test
```

To use an existing Chrome installation on Windows, choose its Playwright channel in PowerShell after running `npm ci`.

```powershell
$env:PLAYWRIGHT_CHANNEL = "chrome"
npm test
```

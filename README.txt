Iqra University - Online Course Platform
Login & Registration UI (HCI Assignment)
==========================================

HOW TO RUN
-----------
Just open "index.html" in any web browser (Chrome, Edge, Firefox).
No server or installation needed.

FILE STRUCTURE
--------------
index.html    - the page markup (uses Bootstrap 5 for layout/components)
style.css     - custom styles on top of Bootstrap (colors, decorative panel)
script.js     - all the interactive logic (validation, login/register, etc.)
assets/       - Bootstrap 5.3.3 CSS + JS, included locally so the project
                works fully offline (no internet connection needed)
images/       - Iqra University logo (used in the top bar and the left panel)

Keep all of these files and folders together in the same place - index.html
links to the others using relative paths (e.g. "assets/bootstrap.min.css",
"images/iqra-logo.png", "style.css", "script.js").

DEMO ACCOUNT
------------
Username: ahmed_testing
Password: Demo@1234

You can use this to test the Login page directly, or click
"Create an account" to register a new one (it is saved in the
browser's localStorage, so it stays there if you reopen the file
in the same browser).

WHAT'S INCLUDED
----------------
1. Login page
   - Username/email field, password field with a show/hide icon button
   - Remember Me checkbox
   - Forgot Password link (opens a reset panel)
   - Link to the Registration page
   - Field validation (live, while typing, and again on submit)
   - Success message / welcome panel after login

2. Registration page
   - Full Name, Email, Username, Password, Confirm Password
   - Course selection (Computer Science, Artificial Intelligence,
     Software Engineering, Human Computer Interaction, and a few more)
   - Password strength checklist
   - Field validation (live + on submit)
   - Success message after registration

3. "Design notes" page (top-right link inside the app)
   - A written explanation of how the design applies Jakob Nielsen's
     10 Usability Heuristics and Shneiderman's Eight Golden Rules of
     Interface Design, element by element.

4. Help ("?" button) and Forgot Password - both open as Bootstrap
   modal dialogs rather than new pages.

NOTE
----
This is a front-end-only prototype built for a coursework assignment.
Accounts are stored in the browser (localStorage), not on a real server,
so this is for demonstration purposes only.

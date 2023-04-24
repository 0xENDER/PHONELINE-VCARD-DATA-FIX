# PHONELINE vCard format fixer (vCard 3.0 to 2.1)

You can use this project to generate a v2.1 vCard data file (from v3.1 vCard format) for old PHONELINE flip phones.

> Current support only for name and phone number data conversion. (No plan to add support for other data types, unless needed)

## How to run

### Using NodeJS

Run the command:

```cmd
node phoneline-fix-vcard.js
```

Then provided the required input. (*Use absolute paths*)

### In browser/JS environment

You can use the function `___PHONELINE__VCARD_3_0__TO_2_1___`!

**Input:** text (*vCard v3.0 data*)
**Output:** text (*vCard v2.1 data*)

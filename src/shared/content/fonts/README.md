# Social preview fonts

Local static TTF subsets keep social-image builds independent of font services.
The accompanying SIL Open Font License files cover both families.

- **Fraunces Black**: weight 900, optical size 9, matching Cloud's heavy wordmark.
  Used for the wordmark and headlines. Source: [Google Fonts](https://fonts.google.com/specimen/Fraunces).
- **Inter Regular**: weight 400 for descriptions.
  Sources: [Google Fonts](https://fonts.google.com/specimen/Inter).
  Included ranges: `U+0000-024F,U+0300-036F,U+2000-206F,U+20A0-20CF,U+2190-21FF`.

Subsets were produced with FontTools, preserving name records and font licenses.
To refresh, download static TTFs for these weights (not WOFF2 or variable fonts),
then use `pyftsubset` with `--unicodes` and the ranges above for both families, plus `--name-IDs='*' --name-legacy --name-languages='*'`.
If content introduces another writing system, extend the font subsets before
publishing it. The PNG render tests exercise the local fonts without network access.

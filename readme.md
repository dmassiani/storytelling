Story Telling for Wordpress
==========

## the_story()
Storytelling inject multi content where you need.

You can design structured macro-content template **powerfull with sass**, you can choose any anywhere.

## How to use?
- Install Plugin first (git clone or download this)
- Active Storytelling plugin
- Make "storytelling" folder in your theme
- Design macro-template **see section Storytelling Template**
- Add **the_story()** in your template

### In admin
- Design new page or post
- Choose Template in sidebar
- Design beautiful story

## Storytelling Template

### Data needed

In your macro-template, Storytelling must-read 3 important data.

Template Name - Description - Elements

Storytelling use Wordpress reading data like :

/*

Template: MacrocontentA

Description: Description for your customers

{**"type"**: "image", **"name"**: "Left Image", **"slug"**: "left_image"}

*/

#### Template Name

Please you need to use slugged name like powerfull_slug

#### Description

Description is used by your customers (if needed)

#### Structured element

Element is the most important chapter you need to know.

Is is really important your think about your structured macro-template.

Today, Storytelling don't have capability to manage content resulting to element removed or modified from macro-template.

In a future release.

You have content with macro-template linked? Don't touch macro template used.

==========

Elements use Json.

Elements need 3 data : type, name and slug

Available type : editeur and image

**sorry about 'editeur', It is French, I change that in near futur**

name is for admin **not available yet**

slug is for extract right data in right place **see section the_chapter()**

**you can found an example in story-telling/front/macro-template-example.php**
# Overview

## Home page

The entry point of our application should be used to authenticate a user and get his
account type (Admin or Operator). Its sole purpose is to redirect the user to the
[Projects listing page](#projects-listing-page) with the right permissions.

### MVP

#### View

In order to save time, we will not be developping a user system. Instead,
we will create two links within this page which will act as a "user login".
The first link will "log" the user in as an Admin, and the second one as an Operator.

### Nice to have

* Cookie/LocalStorage system to persist user session
* Create a user system with basic functionality (creation, login)
* Add more functionality to user system (reset/recover password, modify account...)

## Projects listing page

This page will present all dataset annotation projects and give an Admin the possibility to
create new ones.

### MVP

#### View

We will distinguish four types of projects:

* The draft ones, which do not contain the definitive set of audio samples. They are visible by Admins only.
* The ongoing ones which are currently being annotated by an Operator.
* The ones to be reviewed by an Admin.
* The ones that have been marked as being completed by an Admin.

For clarity purposes, we should distinguish them within the UI by affecting a status for each project type.

The list will be ordered by latest update date by default.

**Each project will display the following data:**

* Title
* "Created at" date
* "Updated at" date
* Percentage of audio samples annotated by Operator
* Number of audio samples
* Number of audio samples skipped by Operator
* Due date if project is not completed
* Percentage of annotated audio samples reviewed and accepted by Admin
* Status

#### Actions

|Availability|Action|
|-:|-:|
|Admins|Create a new project|
|Admins & Operators|Access [Project page](#project-page) by clicking on project title|

### Nice to have

* Add pagination, sorting and filtering possibilities.
* Give Admins the possibility to delete a project.
* Give Admins the possibility to assign a project to Operator(s) (depends on development of user system).

## Project page

This page will present a project and all of its associated audio samples.

### MVP

#### View

The view slightly changes depending on the status of the project and the status of an audio sample.
In any case, the user will always see the title of the project and
some other basic informations (created at, last update...). The user will
also always be able to consult the list of audio samples, play them, and consult their annotations (if any).

**"Draft" view:**

Only Admins can access this view.

We will display an uploader in this view to upload audio samples.
We will also display a button to switch project status to "ongoing". This is only possible if there is at least one audio sample within the project.

**"Ongoing" view:**

Admins and Operators can access this view.

Here, an Operator will be able annotate audio samples.
In order to do so we will give the ability to play the sample and we will create
a basic form with 5 values:

* Wake start time
* Wake end time
* Utterance start time
* Utterance end time
* Text transcript

The Operator will have to fill in all values before submitting them for review. We might
change this constraint in the future. The Operator can also skip the annotation of an audio sample.
Once submitted, an Operator will not be able to modify the audio samples' annotation, unless it is rejected by an Admin.
Finally, Operators will be able to change the status of the project to "review".

Admins will be able to review audio samples annotations that are submitted, even the skipped ones. They can either "accept" the annotation or "reject" it. Finally, Admins will be able to change the status of the project to "completed" (accepted review).

#### Actions

|Availability|Action|
|-:|-:|
|Admins|Upload audio samples to project|
|Admins|Set project to "ongoing" which makes it available to Operators. Audio samples cannot be added after this.|
|Admins|Set project to "completed". Can only be done when project status is "review".|
|Admins|Accept or reject the annotation of an Operator.|
|Operators|Define start and end time of wake word and utterence within audio sample|
|Operators|Submit audio sample annotation for review|
|Operators|Submit project for review|
|Admins & Operators|Play audio samples|

### Nice to have

* Explore as many different ways to annotate an audio sample to make the task the most efficient and enjoyable possible.
* Add an export CSV action (with all annotations and audio sample IDs) for completed projects, could be very useful for research teams.
* Add possibility to enrich metadata of an audio sample (internal track ID, provider, quality rating...). Could be useful for display, storage, classification and also for purchasing teams.
* Give Admins the possibility to rename a project.
* Give Admins the possibility to delete a project.
* Maybe give Admins the possibility to modify audio samples list when project is not a draft anymore. A lot of questions comes with this (what if there are no more audio samples in list? how does it affect the status of a project?).

## Hypothetical models

#### Project

```js
{
  _id: ObjectId,
  title: String,
  status: {
    type: String,
    enum: ['draft', 'ongoing', 'review', 'completed'],
  },
  createdAt: Date,
  updatedAt: Date,
}
```

#### Audio Sample

```js
{
  _id: ObjectId,
  projectId: ObjectId,
  title: String,
  sampleUrl: String,
  status: {
    type: String,
    enum: ['ongoing', 'review', 'accepted', 'rejected']
  },
  skipped: Boolean,
  annotations: {
    wake: {
      start: Number,
      end: Number,
    },
    utterence: {
      start: Number,
      end: Number,
    },
  },
  submittedAt: Date,
  reviewedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}
```

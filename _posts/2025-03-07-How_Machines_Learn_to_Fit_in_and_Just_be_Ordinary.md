---
author: w-thurston
layout: post
title: How Machines Learn to Fit in and Just be Ordinary
description:
date: 2025-03-07 8:00:00 -0700
categories: [Let's Learn, ML How-To]
tags: [let's-learn, ml-how-to] # TAG names should always be lowercase
mathjax: true
---

*If you don't mind, just pretend we segue'd from your question in the last article straight to this section.  I felt keeping the previous article to the single idea of understanding $$f(X)$$ to be easier on the mind than trying to also jam in this article's information.*

The natural bridge between the possibly abstract idea $$Y = f(X) + \epsilon$$ and any real-world application is the **Ordinary Least Squares** (OLS) method, more commonly known as **Simple Linear Regression**.  A very *textbook* definition of Linear Regression is:

> Assuming there is an approximately linear relationship between one independent variable ($$X$$) and a dependent variable ($$Y$$), by fitting a straight line we can predict a quantitative response ($$Y$$) on the basis of a single predictor variable ($$X$$).

ZzZz...  Was that as boring for you to read as it was for me to write? I hope not! OLS or Simple linear regression is our first tool for making sense of data. It is one of the foundational pieces for all of machine learning and it is important for us to learn its concepts to prepare for the more exciting models and methods.  To describe it a little more simply, simple linear regression is where we take in one input value, plug that value into our trained model (which is just a straight line on a graph), and output a response or prediction value.  Here are a few examples to illustrate this concept:
- Given a person's height, predict their weight.
- Given the temperature of the day, predict the number of ice cream cones sold.
- Given amount of time studied, predict your test score.
- Given a specific drug dosage, predict blood pressure.

In reality, you can build a model to predict anything, but whether those predictions are meaningful depends on the data and relationships involved.  A popular example of a potentially not useful model is: Given the number of ice cream cones sold, predict the number of shark attacks.  You might be wondering why the number of ice cream cones sold would have anything to do with shark attacks.  While there might be a *correlation* between the number of ice cream cones sold and shark attacks, there probably isn't any proof of *causation* between the two.  

The true connecting variables, that we are not capturing in our simple model, are probably things like: season, temperature, and number of people at the beach.  Hot temperatures in the summer months lead to more people at the beach, which increases both the number of people in the water (higher chances of shark encounters) and the demand for a tasty cold treat.  Since we are focusing on **simple** linear regression here, we will stick to just one input variable but this concept of "there could be more data out there to collect to better our models" is an important concept that we will be continuing to touch upon throughout this series.

Remember the secret formula I shared from the [last article](../Why_the_F_does_it_matter):
\begin{align\*}
  Y = f(X) + \epsilon \tag{1}\\\\<br>
\end{align\*}

Well now we have the opportunity to connect it to something a little more tangible to see how it works.  The formula for Simple Linear Regression is:
\begin{align\*}
  Y \approx \beta_{0} + \beta_{1}X \tag{2}\\\\<br>
\end{align\*}
Where:  
- $$Y$$: The predictions or output of the function
- $$\approx$$: "is approximate to"
- $$\beta_{0}$$ (beta zero): The value of $$Y$$ when $$X=0$$ (where the line intersects the Y-axis).
- $$\beta_{1}$$ (beta one): The change in $$Y$$ for each 1-unit increase in $$X$$ (the slope of the line).
- $$X$$: Our input data

In terms of Simple Linear Regression, the function $$f(X)$$ we talked about earlier is now specifically defined as $$\beta_{0} + \beta_{1}X$$.  But what are these two new squiggly letter B's? $$\beta_{0}$$ and $$\beta_{1}$$ are known as *coefficients* or *parameters*.  Coefficients are the things that will do most of the heavy lifting when it comes to machine learning.  They are the variables we will change or *tune* during model training to help us go from a not-so-good model to a model that performs well for the task at hand.  One final tidbit to drive home how you can think about Simple Linear Regression: equation $$(2)$$ might look strangely familiar.  If it reminds you of the grade-school equation for a line, $$y=mx+b$$, that’s because it is the same concept.  Here, $$\beta_{0}$$ is equivalent to $$b$$ (the intercept) and $$\beta_{1}$$ is equivalent to $$m$$ (the slope).  In other words, when we build a Simple Linear Regression model, all we’re doing is finding the 'line of best fit' for our input data.

As an additional note, we were discussing samples and populations in the previous article and we run into a similar scenario here because equation $$(2)$$ would be representative of the relationship of the entire population between X and Y or, said in another way, equation $$(2)$$ is the *true* equation that describes the 'line of best fit'.  Technically, we will be working with the following equation, the key difference being we are showing that we are working with estimations of $$\beta_{0}$$ and $$\beta_{1}$$ rather than their true values:
\begin{align\*}
  \hat{y} = \hat{\beta_{0}} + \hat{\beta_{1}}x \tag{3}\\\\<br>
\end{align\*}

### Fitting in and remaining ordinary

I have mentioned training or tuning our models a couple of times now, but what does that really mean?  In terms of Simple Linear Regression, training a model consists of adjusting the coefficients or parameters of our model (changing the value of the squiggly B's) such that we produce a straight line that most closely fits our input data.  The most popular method to measure this "closeness" is called *Ordinary Least Squares*.  The "ordinary" portion of the name is there to differentiate this method from the other more complex methods that perform a similar "least squares" operation.  You may also think of this method as "Simple Least Squares".  Least Squares builds upon a concept known as *residuals*.  A residual is the difference, or distance, between the original expected $$y$$ value and the line we've just created.  

If we let the following be the prediction for $$i$$-th value of $$Y$$ based upon the $$i$$-th value of $$X$$:
\begin{align\*}
  \hat{y_{i}} = \hat{\beta_{0}} + \hat{\beta_{1}}x_{i}
\end{align\*}
Then the $$i$$-th residual ($$e_{i}$$) can be found by:
\begin{align\*}
  e_{i} = y_{i} - \hat{y_{i}} \tag{4}
\end{align\*}
Where:  
- $$y_{i}$$: Original expected output value
- $$\hat{y_{i}}$$: The predicted value from our regression line

> **Note:** When I say "$$i$$-th", what I am referring to is basically the row number of a particular observation in our data.  If we had a dataset of 5 observations and I wanted to call attention to the 3rd observation, then placing that into the equations above we would have: "$$\hat{y_{3}} = \hat{\beta_{0}} + \hat{\beta_{1}}x_{3}$$"  &   "$$e_{3} = y_{3} - \hat{y_{3}}$$".

Again, the residual is the difference between the $$i$$-th actual y value ($$y_{i}$$) and the $$i$$-th predicted y value ($$\hat{y_{i}}$$).  If we repeat this process of finding the residuals for each of our $$n$$ (number of total observations in our data set (in the note above $$n=5$$)) observations, we can then compute the *Residual Sum of Squares (RSS)*.  RSS is the tool we use to measure and update $$\beta_{0}$$ and $$\beta_{1}$$ during training.  I have found RSS's naming to be a bit odd since what we are doing is gathering the sum of the squared residuals; why they chose to put the 'residual' portion in the front of the phrase, I do not know but, that is neither here nor there just a personal brain hold up.  To further our understanding of "gathering the sum of the squared residuals"(RSS), let's look at the formula and continuously expand it down to its least aggregated parts:
\begin{gather}
  RSS = \sum_{i=1}^{n} e_{i}^2 \tag{5}\\\\<br>
  ----------------------------\\\\<br>
  RSS = e_{1}^2 + e_{2}^2 + ...  + e_{n}^2 \\\\<br>
  ---------------------------------------\\\\<br>
  RSS = (y_{1} - \hat{y_{1}})^2 + (y_{2} - \hat{y_{2}})^2 + ... + (y_{n} - \hat{y_{n}})^2\\\\<br>
  ---------------------------------------------------------------------------------------\\\\<br>
  RSS = (y_{1} - \hat{\beta_{0}} - \hat{\beta_{1}}x_{1})^2 + (y_{2} - \hat{\beta_{0}} - \hat{\beta_{1}}x_{2})^2 + ... + (y_{n} - \hat{\beta_{0}} - \hat{\beta_{1}}x_{n})^2
\end{gather}

We can see that all RSS is doing is summing up the squared values of equation $$(4)$$ for each observation in our dataset.  The reason we square residuals is to ensure all errors contribute positively to the total sum, preventing negative values from canceling out positive ones.  If we didn’t square them, residuals for points below the regression line would be negative, which could offset the positive residuals above the line—making the total error misleading.

Another reason to square residuals is that it gives more weight (and therefore, greater influence) to larger errors.  This is important because a ‘line of best fit’ should be more affected by points that are farther from it.  If our goal is to find a line that not only fits the data we are giving it but future data as well (otherwise known as generalizing), we’d prefer many small errors rather than a few large ones.  Large deviations indicate our model may not be accurately capturing the relationship in the data.

The Least Squares methodology aims to find values $$\beta_{0}$$ and $$\beta_{1}$$ that minimize the Residual Sum of Squares.  In Simple Linear Regression, you can directly calculate estimates of the coefficients:
\begin{align\*}
  \hat{\beta_{1}} = \frac{\sum_{i=1}^{n} (x_{i} - \bar{x})(y_{i} - \bar{y})}{\sum_{i=1}^{n} (x_{i} - \bar{x})^2} \tag{6}\\\\<br>
\end{align\*}
\begin{align\*}
  \hat{\beta_{0}} = \bar{y} - \hat{\beta_{1}}\bar{x} \tag{7}
\end{align\*}
Where:
- $$\sum_{i=1}^{n}$$: symbol for iteratively summing 
- $$\bar{y}$$: mean of our data's y values
- $$\bar{x}$$: mean of our data's x values

Let's pause there on the information overload and step away from the equations for a moment.  I want to give you the opportunity to tanglibly interact with and see these concepts in action before we move on.  Below we have a graph of a Simple Linear Regression model.  The points on the graph are arbitrary in that I randomly chose some X and Y values to be presented to start with.  With this graph you may add, remove, or move each data point to see how the regression line and its' coefficients change based on your interactions in real time. This will help you visualize the math we have discussed so far.

Important pieces of information to highlight are:
- The orange line: This is the Linear Regression line
- The blue points: Our arbitrary points representing our training data
- The beige dashed lines: These represent the residuals
- β_0 & β_1: Intercept($$\beta_{0}$$) and Slope($$\beta_{1}$$)
- The Y = MX + B syntax to connect back to

---
<!-- Vue will control everything inside this div -->
<div id="slrLines" style="background: #212121; border-radius: 25px; text-align: center;"></div>

<!-- External JS file to mount Vue -->
<script src="/assets/js/slrLines.js" type="module"></script>
---
Now that you have had some time to play with the graph above, I would like to add some additional insights to solidify your understanding of this topic. We now understand the blue points on the graph to be our input data. As we alter these points, whether that be adding more, removing some, or moving them about, we see the impact it has on the orange regresssion line. Think of those actions you are taking on the blue points as altering our input dataset similar to how you would add, remove or change a row or cell in Excel. The beige lines connecting the blue points to the orange regression line are our residuals and the intersection between the regression line and each residual line is the output or prediction of our model.  $$\beta_{1}$$ and $$\beta_{0}$$ are calculated via equations $$(6)$$ and $$(7)$$ respectively and are how we generate the regression line.

If we take these concepts and connect them back to the equations we have above we get the following:
- $$\hat{y} = \hat{\beta_{0}} + \hat{\beta_{1}}x $$ 
  - $$\hat{y}$$: The intersection between the regression line and residual.
  - $$\beta_{0}$$ and $$\beta_{1}$$: Shown in the upper left of the graph and are the intercept and slope of the regression line.
  - $$x$$: The X coordinate of the current blue point. 
- $$e_{i} = y_{i} - \hat{y_{i}}$$
  - $$e_{i}$$: The length of the beige residual lines
  - $$y_{i}$$: The Y coordinate of the current blue point. 
  - $$\hat{y_{i}}$$: Described above
<br><br>
Now, that we have our regression line and an "error" value for each point of data, we need to calculate the Residual Sum of Squares (RSS).  But first I want to show you a second graph:

---
<!-- Vue will control everything inside this div -->
<div id="slrSquares" style="background: #212121; border-radius: 25px; text-align: center;"></div>

<!-- External JS file to mount Vue -->
<script src="/assets/js/slrSquares.js" type="module"></script>
---

You may notice that if you were to reset the first graph (refresh the webpage) that this second graph and the first one are nearly identical, the key difference is there are dashed squares instead of dashed lines.  We pause for a second to have the opportunity to have another blast from the past with the equation of the "area of a square": $$Area = height^2$$.  The height of a square is just the length of a single side.  The dashed lines are just a single side of these new squares and the dashed lines represented the "error" for each individual point.  These dashed squares are therefore here to visually represent the squared error.  

To connect these ideas back to an equation: if you take a look back at equation $$(5)$$ you see the term $$e_{i}^2$$ and remembering back to just a second ago we saw that $$e_{i}$$ was just the length of the dashed lines.   Well, $$e_{i}^2$$ is just the "area of the dashed square". So, equation $$(5)$$ is just a sum of the area of the squares.  You have just computed the Residual Sum of Squares!  I really like the visualization of the error as squares because when we are reminded that our main goal is to minimize the RSS it is very easy to see that as we move the blue points closer to the orange regression line, the squares become smaller ie. our error is shrinking.  One more thing, if we were to purely sum the length of each line, the ones below the regression line would have a negative value.  When we sum up all of the areas of the squares we always have a positive number because we cannot have a negative area of a square.

I do want to caution you, in our data, we are not changing our data to fit the line. When we move the data on these graphs, we are essentially saying "we have new data points" or "the values of our data have changed".  The moving of the points is there to show you how having different samples of data effect the regression line and consequently effects the magnitude of our error.

At this point, we’ve built a regression model, estimated its coefficients, and even visualized how errors contribute to our fit. But how do we know if our model is actually any good? Sure, we minimized RSS, but does that mean we have a reliable predictor?

In the next article, we’ll tackle this head-on. We’ll explore how to measure model accuracy, assess the reliability of our coefficient estimates, and determine whether our regression line is just a well-fitted illusion or a genuinely useful model.

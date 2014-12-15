ryanmrbot
=========

A simple twitter bot for [@ryanmr](http://twitter.com/ryanmr) on Twitter.

Information
-----------

This is generic information about the bot currently:

* this bot runs once a minute
* there is a set of options, which are chosen on a randomized seed value
* there is a primitive tweet limiter, so obnoxiousness will be reduced

There is only one tentpole feature currently:

* let [@ryanmr](http://twitter.com/ryanmr) know when his Nexus 6 might arrive...

What else should this bot do?

How To Run
----------

You can run this little bot with:

```node ryanmrbot.js```

If you have [forever](https://www.npmjs.com/package/forever) installed, you can also utilize that as well:

```forever start -l forever.log -o out.log -e error.log  -v -m 1 ryanmrbot.js```

This ```forever``` command will start the bot as a background process - a daemon.


Finally
-------

You should follow [@ryanmr](http://twitter.com/ryanmr) on Twitter.
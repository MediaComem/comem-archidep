# Make TCP connections

This guide describes how to establish and use raw TCP connections with the
[**n**et**c**at (`nc`) command][nc].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Legend](#legend)
- [:exclamation: Communicate between servers](#exclamation-communicate-between-servers)
  - [:exclamation: **Bob:** listen for TCP clients](#exclamation-bob-listen-for-tcp-clients)
  - [:exclamation: **Alice:** connect to Bob's server](#exclamation-alice-connect-to-bobs-server)
  - [:exclamation: Communicate!](#exclamation-communicate)
- [:exclamation: Talk ~~dirty~~ HTTP to Google](#exclamation-talk-dirty-http-to-google)
- [:checkered_flag: What have I done?](#checkered_flag-what-have-i-done)
  - [:classical_building: Architecture](#classical_building-architecture)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Legend

Parts of this guide are annotated with the following icons:

- :exclamation: A task you **MUST** perform to complete the exercise.
- :question: An optional step that you _may_ perform to make sure that
  everything is working correctly.
- :warning: **Critically important information about the exercise.**
- :gem: Tips on the exercise, reminders about previous exercises, or
  explanations about how this exercise differs from the previous one.
- :space_invader: More advanced tips on how to save some time. Challenges.
- :books: Additional information about the exercise or the commands and tools
  used.
- :checkered_flag: The end of the exercise.
  - :classical_building: The architecture of what you deployed during the
    exercise.
- :boom: Troubleshooting tips: how to fix common problems you might encounter.



## :exclamation: Communicate between servers

You need to find a partner for this part of the exercise, since the goal is to
establish a TCP connection between two of the servers you have set up for the
course.

Let's call you **Bob** and your partner **Alice**.

Alice will need to know the public IP address of Bob's server. We will refer to
it as `W.X.Y.Z`.

### :exclamation: **Bob:** listen for TCP clients

Bob should run the `nc` command on his server to listen for TCP connections on
port 3000:

```bash
$> nc -l 3000
```

> :books: At this point, `nc` will start **l**istening on port 3000 and take
> over the console, waiting for a TCP client to connect.

### :exclamation: **Alice:** connect to Bob's server

Alice should run the `nc` command on her server to connect to TCP port 3000 on
Bob's server:

```bash
$> nc W.X.Y.Z 3000
```

> :books: Here, `nc` is acting as a client, connecting to the listening `nc`
> process on Bob's server.

### :exclamation: Communicate!

Bob should type "Hello" and press `Enter` to send this text:

```bash
$> nc -l 3000
Hello
```

It should be immediately displayed in Alice's terminal:

```bash
$> nc W.X.Y.Z 3000
Hello
```

Similarly, if Alice types "World" after that and presses `Enter`:

```bash
$> nc W.X.Y.Z 3000
Hello
World
```

It should appear in Bob's terminal:

```bash
$> nc -l 3000
Hello
World
```

You have a two-way raw TCP connection running.

Once you're done, you can close the connection with `Ctrl-C`.



## :exclamation: Talk ~~dirty~~ HTTP to Google

Let's do something that your browser does every day: an HTTP request.

Find out Google's IP address (`O.P.Q.R` in this example) using the [`ping`
command][ping]:

```bash
$> ping -c 1 google.com
PING google.com (`O.P.Q.R`) 56(84) bytes of data.
64 bytes from google.com (O.P.Q.R): icmp_seq=1 ttl=53 time=0.890 ms
...
```

Open a TCP connection to the Google IP address you found:

```bash
$> nc O.P.Q.R 80
```

Now, talk to this Google server, but not in English or French, in the [HTTP
protocol][http]:

```bash
GET / HTTP/1.1
Host: www.google.com
```

> :gem: Be sure to type **exactly** the text above. Your request must be a valid
> HTTP request or Google's server will not be able to interpret it correctly. If
> you have made a mistake, exit with `Ctrl-C` and start over.
>
> :books: By sending this text over the TCP connection, you are communicating in
> the HTTP protocol, a text protocol: you are sending an HTTP request to
> retrieve (`GET`) the resource at path `/` of host `www.google.com` (the
> landing page of the Google website), using version `1.1` of the HTTP protocol.

Press `Enter` twice and you should receive the HTML for Google's home page.

> :boom: If you get a `400 Bad Request` response, it means that your HTTP
> request is invalid. You probably did not type exactly the text above.
>
> :boom: If you don't get a response, it may be because you took too long to
> type the text, and the request has timed out. Try again a little faster.

Once you're done, you can close the connection with `Ctrl-C`.

If you open your browser, visit `http://www.google.com` and display the source
code of the page, you should see the same result.



## :checkered_flag: What have I done?

Contratulations!

Like the pioneers of the 1970s who developed the TCP/IP suite, you have
established a TCP connection between two machines and exchanged some (hopefully
nice) words with your classmate.

You have also spoken HTTP directly to Google's web server on a TCP connection,
demonstrating the layering of the OSI model:

* You have hand-written an HTTP request, a level 7 application protocol. As
  you've seen, this is simply text written in the correct format.
* You have sent this request through a TCP connection, a level 4 transport
  protocol.
* To reach the correct host, you have used an address of the **I**nternet
  **P**rotocol (IP), a level-3 network protocol.

> :books: There are other protocols in other layers at work, but these are the
> ones that interest us in the context of this course.

You can also now fully appreciate what your browser does for you every day.

### :classical_building: Architecture

This is a simplified architecture of the main running processes and
communication flow during this exercise:

![Architecture diagram](tcp-architecture.png)

> [Architecture diagram PDF](tcp-architecture.pdf).



[http]: https://en.wikipedia.org/wiki/HTTP
[nc]: https://en.wikipedia.org/wiki/Netcat
[ping]: https://en.wikipedia.org/wiki/Ping_(networking_utility)

# gcr-cleanup

Script that can flexibly curate Docker images from one or more gcr.io repositories.

Use this tool when you have a variety of repositories in a gcr.io project and want to clean them up in a unified way.

## Usage

Run locally (from git) like so:

```sh
> GCLOUD_TOKEN="$(gcloud auth print-access-token)" ./mod.ts gcr-cleanup.toml --yes
Processing 13 image repositories...
Deleted conduit-api-server sha256:7945f71ff4917bafcf216f7a20ebf2dab81864536c1f479a994430851d916d2c [ "bee0ffa" ] from 2019-12-20T08:56:40.163Z - 27484931 bytes
Deleted deno-module-visualizer sha256:ed2956b1175c78ceec730789c3d0c425151971b15e95dae4532a99c46b9cd3ea [ "v1beta15" ] from 2021-02-02T11:31:16.739Z - 41639555 bytes
Deleted deno-module-visualizer sha256:9abd2a8d842fb56dc29672d869b901d2cfd344c0462f64283c6118c5d1580de2 [ "v1beta16" ] from 2021-02-02T20:07:24.243Z - 41655942 bytes
Deleted deno-module-visualizer sha256:ad4579aa58a090d99280f8dc498da50b71bdebeb1d7bd1fafd2f09aac4c4abd4 [ "v1beta17" ] from 2021-02-02T21:08:38.652Z - 41654546 bytes
Deleted deno-module-visualizer sha256:7e250dc226b863494f23e64de1962cb0b088d97c8d721314c3df260930b45875 [ "v1beta18" ] from 2021-02-04T16:31:09.961Z - 41674123 bytes
Deleted deno-module-visualizer sha256:5b714dce6c0c94d1fd9b2cf09e46bf9ce3e29f54781e5dbff858e3a6d9682b0a [ "v1beta19" ] from 2021-02-04T16:41:50.361Z - 41674135 bytes
Deleted deno-module-visualizer sha256:76eb4bc86f6c2f02aeaee5858139da255a635f84cb60c6154f69db1d46406a00 [ "v1beta20" ] from 2021-02-04T16:47:56.115Z - 41674610 bytes
Deleted dust-poc sha256:33632a47b42d226063c023d4559e0a79770bbe7efccf7867a8edca95d0c1631b [ "ebdd052" ] from 2020-08-19T15:48:06.611Z - 98152329 bytes
Deleted dust-poc-kubectl sha256:ea26eb6191c95088dfcd84d71e3e8b87a8b31645c49532398a9fd6256b8ff09a [ "8e2fa3d" ] from 2020-08-19T15:20:10.158Z - 99643488 bytes
Deleted dustjs-backend-firebase sha256:ad1cc44605e205ba39d74b2fd44d305fc04dfb792408362fc41ad9d53a78d2f3 [ "8c4ce01" ] from 2020-05-28T18:16:00.720Z - 55234994 bytes
Deleted firebase-server sha256:fc61420deec6d7886218246141df1381126ddec39adc89d3680cf5b717e9d5ce [ "72e66ba" ] from 2019-08-06T05:47:38.903Z - 56242443 bytes
Deleted kubernetes-dns-sync sha256:f7aeb0e6dd1fbb4634b441d202cc671d37269de748516199d41e9943c298661c [] from 2021-01-29T06:10:51.961Z - 30823802 bytes
┌───────┬───────────────────────────────────┬────────────┬──────────┬──────────────────────────┬─────────────┬──────────────┬──────────────────────────┬───────┐
│ (idx) │             imageName             │ tagsBefore │ gbBefore │       oldestBefore       │ tagsDeleted │  gbDeleted   │       oldestAfter        │ error │
├───────┼───────────────────────────────────┼────────────┼──────────┼──────────────────────────┼─────────────┼──────────────┼──────────────────────────┼───────┤
│   0   │ "amazon-eks-pod-identity-webhook" │     4      │    0     │ 2020-08-18T19:16:33.182Z │             │              │                          │       │
│   1   │           "build-shell"           │     3      │    1     │ 2019-05-17T05:09:11.345Z │             │              │                          │       │
│   2   │       "conduit-api-server"        │     7      │    0     │ 2019-12-20T08:56:40.163Z │      1      │      0       │ 2019-12-20T09:51:17.459Z │       │
│   3   │              "deno"               │     5      │    0     │ 2021-01-28T19:59:47.845Z │             │              │                          │       │
│   4   │     "deno-module-visualizer"      │     11     │    1     │ 2021-01-31T16:48:54.111Z |      6      │      1       │ 2021-02-04T17:01:35.427Z │       │
│   5   │            "dust-poc"             │     6      │    0     │ 2020-08-19T15:48:06.611Z │      1      │      0       │ 2020-08-19T16:12:13.535Z │       │
│   6   │        "dust-poc-kubectl"         │     7      │    1     │ 2020-08-19T15:20:10.158Z │      1      │      0       │ 2020-08-19T15:48:15.492Z │       │
│   7   │           "dust-server"           │     2      │    0     │ 2019-11-04T06:59:08.746Z │             │              │                          │       │
│   8   │      "dustjs-automaton-lua"       │     5      │    0     │ 2020-05-25T19:26:29.871Z │             │              │                          │       │
│   9   │     "dustjs-backend-firebase"     │     7      │    0     │ 2020-05-28T18:16:00.720Z │      1      │      0       │ 2020-05-29T12:55:15.322Z │       │
│  10   │         "firebase-server"         │     5      │    0     │ 2019-08-06T05:47:38.903Z │      1      │      0       │ 2019-08-06T05:49:12.772Z │       │
│  11   │       "kubernetes-dns-sync"       │     4      │    0     │ 2021-01-29T06:10:51.961Z │      0      │      0       │ 2021-01-29T07:42:25.197Z │       │
│  12   │             "nagios"              │     5      │    1     │ 2020-05-09T09:28:37.866Z │      0      │      0       │ 2020-05-09T09:28:37.866Z │       │
└───────┴───────────────────────────────────┴────────────┴──────────┴──────────────────────────┴─────────────┴──────────────┴──────────────────────────┴───────┘
```

## Config

See `gcr-cleanup.toml` for a full example.

### Delete all untagged, nothing else

```toml
[[rule]]
image_patterns = [ "nagios" ]
```

### Keep only most recent images

```toml
[[rule]]
image_patterns = [ "nagios" ]
keep_count = 5
allow_tagged = true
```

### Delete previous githash images from *every* repository

```toml
[[rule]]
image_patterns = [ ",+" ]
keep_count = 5
allow_tagged = true
tag_filter = "[0-9a-f]{7}"
```

### Delete all beta images after a week

```toml
[[rule]]
image_patterns = [ "deno-module-visualizer" ]
keep_days = 7
allow_tagged = true
tag_filter = "v\d+(beta|alpha).+"
```

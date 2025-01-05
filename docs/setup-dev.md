## tools
we are using moon repo to manage this project, and it is absolute the best.

### first install proto (optional but recomended)

you can skip this but that install moon any other way you like: (https://moonrepo.dev/docs/install)[https://moonrepo.dev/docs/install]

to install on any reasonable os:

```
curl -fsSL https://moonrepo.dev/install/proto.sh | bash

```

or windows in powershell as admin:

```
irm https://moonrepo.dev/install/proto.ps1 | iex

```

You may also need to run the following command for shims to be executable:

```
Set-ExecutionPolicy RemoteSigned

# Without admin privileges
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

in case of problems, go to docs: https://moonrepo.dev/docs/proto/install

### than install moon:

#### proto (recomended)
```
proto plugin add moon "https://raw.githubusercontent.com/moonrepo/moon/master/proto-plugin.toml" --to global
proto install moon

```

#### curl

```
curl -fsSL https://moonrepo.dev/install/moon.sh | bash

```

#### bun / npm / pnpm ..etc 
##### NOT TESTED !!!!

```
bun install -g @moonrepo/cli
```

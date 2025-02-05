function process_block_extension(obj) {

    var attrs = obj["attrs"];
    var parent = obj["parent"];
    var reader = obj["reader"];
    var self = obj["self"];
    var nil = obj["nil"];
    var name = obj["name"];

    var title = (attrs['$[]']("title")),
        alt = (attrs['$[]']("alt")),
        caption = (attrs['$[]']("caption")),
        width = (attrs['$[]']("width")),
        height = (attrs['$[]']("height")),
        scale = (attrs['$[]']("scale")),
        align = (attrs['$[]']("align")),
        type = (attrs['$[]']("type")),
        role = (attrs['$[]']("role")),
        link = (attrs['$[]']("link")),
        float = (attrs['$[]']("float")),
        options = (attrs['$[]']("options")),
        imagesdir = parent.$document().$attr('imagesdir', '');

    var filename = "";

    if (!attrs['$[]']("file")["$nil?"]()) {
        filename = "" + attrs['$[]']("file");
    }
    else if (!attrs['$[]'](2)["$nil?"]()) {
        var extension = attrs['$[]'](3)["$nil?"]() ? "" : "." + attrs['$[]'](3);
        filename = "" + attrs['$[]'](2) + extension;
    }

    var command = name;
    var content = reader.$read();

    if (filename != "") {
        target = parent.$image_uri(filename);
    }
    else {
        target = cachedImageUri(content);
        var host = ((typeof location) != "undefined") ? "http://" + location.host : "";
        filename = host + target;
    }


    var stems = ["stem", "asciimath", "latexmath", "mathml"];
    if (stems.indexOf(name) != -1) {
        content = parseStems(parent, content, name);
        command = "math";
    }

    var parameters = [content, type, imagesdir, target, name].map(function (e) {
        return e + "";
    });

    //afx[command].apply(afx,parameters);

    if (["ditaa", "uml", "plantuml", "graphviz"].indexOf(name) != -1) {
        parameters.push(options + "");
    }

    postMessage(JSON.stringify({
        type: "afx",
        func: command,
        parameters: parameters
    }));

    var attributes = {
        "target": filename,
        "title": title,
        "alt": alt,
        "caption": caption,
        "width": width,
        "height": height,
        "scale": scale,
        "align": align,
        "role": role,
        "link": link,
        "float": float
    };

    var keys = Object.keys(attributes);

    keys.forEach(function (key) {
        if (attributes[key]["$nil?"]()) {
            delete attributes[key];
        }
    });

    return self.$create_image_block(parent, Opal.hash(attributes));

};

function registerBlockExtensions(name) {

    /* Generated by Opal 0.11.99.dev */
    (function (Opal) {
        var TMP_1, self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified,
            $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $send = Opal.send;

        Opal.add_stubs(['$register', '$block', '$named', '$on_context', '$parse_content_as', '$process', '$[]', '$create_image_block']);
        return $send($$$($$($nesting, 'Asciidoctor'), 'Extensions'), 'register', [], (TMP_1 = function () {
            var self = TMP_1.$$s || this, TMP_2;

            return $send(self, 'block', [], (TMP_2 = function () {
                var self = TMP_2.$$s || this, TMP_3;

                self.$named(name);
                self.$on_context(["open", "literal", "listing", "pass"]);
                self.$parse_content_as("literal");
                return $send(self, 'process', [], (TMP_3 = function (parent, reader, attrs) {
                    var self = TMP_3.$$s || this, chart_type = nil;

                    if (parent == null) {
                        parent = nil;
                    };

                    if (reader == null) {
                        reader = nil;
                    };

                    if (attrs == null) {
                        attrs = nil;
                    };

                    return process_block_extension({
                        parent: parent,
                        reader: reader,
                        attrs: attrs,
                        self: self,
                        nil: nil,
                        name: name
                    });

                    // return self.$create_image_block(parent, attrs);
                }, TMP_3.$$s = self, TMP_3.$$arity = 3, TMP_3));
            }, TMP_2.$$s = self, TMP_2.$$arity = 0, TMP_2))
        }, TMP_1.$$s = self, TMP_1.$$arity = 0, TMP_1))
    })(Opal);
}

["uml", "plantuml", "ditaa", "math", "graphviz", "tree", "stem", "asciimath", "latexmath", "mathml"].forEach(function (name) {
    registerBlockExtensions(name);
});
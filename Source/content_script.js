var g_bannedtags = ['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEXTAREA'];


//first load of page, walk all DOM tree
walk(document.body);

function walk(node)
{
	var child, next;
	if( !node || $.inArray( node.tagName, g_bannedtags ) !== -1 ) return;
	switch ( node.nodeType )
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child )
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			node.nodeValue=changeText(node.nodeValue);
			break;
	}
}
function changeText(text){
	//change/add here new rules
	text = text.replace(/\bCloud\b/g, "Butt");
	return text;
}
function applyReplacements(node) {
	// Ignore any node whose tag is banned
	if( !node || $.inArray( node.tagName, g_bannedtags ) !== -1 ) return;
	try
	{
		$(node).contents().each(function(i, v) {
			if( v.isReplaced || v.nodeType != Node.TEXT_NODE ) return;
			v.textContent=changeText(v.textContent)
			v.isReplaced = true;
		});
	} catch( err ) {
		// Basically this means that an iframe had a cross-domain source, and WR can't do much about it.
		if( err.name == 'SecurityError' );
		else throw err;
	}
}

function processMutations(mutations){
	mutations.forEach(function(mut) {
		switch(mut.type) {
			case 'characterData':
				applyReplacements(mut.target);
				break;
			case 'childList':
				$(mut.addedNodes).each(function(i, node) { applyReplacements(  $(node).find('*') ); } );
				break;
		}
	});
}

//add a Mutation Listener to any changes to the document body.
new MutationObserver(processMutations).observe(document.body, { subtree: true, childList: true, characterData: true });
